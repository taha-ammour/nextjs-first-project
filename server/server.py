import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from bs4 import BeautifulSoup
import re
import json
from pydantic import BaseModel
from aiocache import Cache
from aiocache import cached
import logging

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure caching
cache = Cache(Cache.MEMORY)

class Movie(BaseModel):
    title: str
    link: str
    img_src: str
    ttid: str
    type: str
    trailer: Optional[str] = None
    img_high: Optional[str] = None
    genres: List[str] = []
    description: Optional[str] = ""
    rating_value: Optional[str] = ""
    rating_count: Optional[str] = ""
    release_date: Optional[str] = ""
    runtime: Optional[str] = ""

async def fetch_html(url: str, retries: int = 3, backoff: int = 2) -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    async with httpx.AsyncClient() as client:
        for attempt in range(retries):
            try:
                response = await client.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                return response.text
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 503:
                    logger.error(f'Server unavailable (503) for URL: {url}, attempt {attempt + 1}')
                    if attempt < retries - 1:
                        await asyncio.sleep(backoff ** attempt)
                        continue
                logger.error(f'Attempt {attempt + 1} failed: {e}')
                if attempt < retries - 1:
                    await asyncio.sleep(backoff ** attempt)
            except httpx.RequestError as e:
                logger.error(f'Attempt {attempt + 1} failed: {e}')
                if attempt < retries - 1:
                    await asyncio.sleep(backoff ** attempt)
        raise RuntimeError(f'Failed to fetch HTML from {url} after {retries} attempts.')

@cached(ttl=3600)
async def fetch_movie_details(link: str) -> dict:
    try:
        details_html = await fetch_html(link)
        details_soup = BeautifulSoup(details_html, 'html.parser')
        title_type = details_soup.find('script', type='application/ld+json')
        if title_type:
            title_data = json.loads(title_type.string)
            trailer_data = title_data.get('trailer', {})
            genres = title_data.get("genre", []) or []
            description = title_data.get("description", "") or ""
            rating_value = str(title_data.get("aggregateRating", {}).get("ratingValue", "") or "")
            rating_count = str(title_data.get("aggregateRating", {}).get("ratingCount", "") or "")
            release_date = title_data.get("datePublished", "") or ""
            runtime = title_data.get("duration", "") or ""
            img_high = title_data.get("image", "") or ""
            title = title_data.get("name", "") or ""

            return {
                'title': title,
                'trailer': trailer_data.get("embedUrl"),
                'img_high': img_high,
                'genres': genres if genres is not None else [],
                'description': description,
                'rating_value': rating_value,
                'rating_count': rating_count,
                'release_date': release_date,
                'runtime': runtime,
                'type': title_data["@type"]
            }
    except Exception as e:
        logger.error(f'Error fetching movie details from {link}: {e}')
        return {}
    return {}

async def parse_search_results(html: str) -> list:
    soup = BeautifulSoup(html, 'html.parser')
    search_results = soup.find('ul', class_='ipc-metadata-list')
    if search_results:
        search = search_results.find_all('li')
        tasks = []
        for result in search:
            title_elem = result.a
            link_elem = result.a
            img_elem = result.img
            
            if title_elem and link_elem and img_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                img_src = img_elem['src']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()
                tasks.append((title, link, img_src, movie_id))

        movie_data = await asyncio.gather(*[fetch_movie_details(task[1]) for task in tasks])

        search_data = []
        for (title, link, img_src, movie_id), details in zip(tasks, movie_data):
            search_data.append(Movie(
                title=details.get('title', title),  # Use the extracted title if available
                link=link,
                img_src=img_src,
                ttid=movie_id,
                type='TV Series' if details.get('type') == 'TVSeries' else 'Movie',
                trailer=details.get('trailer'),
                img_high=details.get('img_high'),
                genres=details.get('genres') if details.get('genres') is not None else [],
                description=details.get('description'),
                rating_value=details.get('rating_value'),
                rating_count=details.get('rating_count'),
                release_date=details.get('release_date'),
                runtime=details.get('runtime')
            ).dict())

        return search_data
    else:
        raise RuntimeError("Couldn't find movie list on the page.")

async def parse_top_tv_shows(html: str) -> list:
    soup = BeautifulSoup(html, 'html.parser')
    search_results = soup.find('tbody', class_='lister-list')
    if search_results:
        search = search_results.find_all('tr')
        tasks = []
        for result in search:
            title_elem = result.find('td', class_='titleColumn').a
            link_elem = result.find('td', class_='titleColumn').a
            img_elem = result.find('td', class_='posterColumn').a.img
            
            if title_elem and link_elem and img_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                img_src = img_elem['src']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()
                tasks.append((title, link, img_src, movie_id))

        movie_data = await asyncio.gather(*[fetch_movie_details(task[1]) for task in tasks])

        search_data = []
        for (title, link, img_src, movie_id), details in zip(tasks, movie_data):
            search_data.append(Movie(
                title=details.get('title', title),  # Use the extracted title if available
                link=link,
                img_src=img_src,
                ttid=movie_id,
                type='TV Series' if details.get('type') == 'TVSeries' else 'Movie',
                trailer=details.get('trailer'),
                img_high=details.get('img_high'),
                genres=details.get('genres') if details.get('genres') is not None else [],
                description=details.get('description'),
                rating_value=details.get('rating_value'),
                rating_count=details.get('rating_count'),
                release_date=details.get('release_date'),
                runtime=details.get('runtime')
            ).dict())

        return search_data
    else:
        raise RuntimeError("Couldn't find TV show list on the page.")

@app.get('/imdb/search/{query}')
async def search_imdb(query: str):
    url = f'https://www.imdb.com/find/?q={query}'
    try:
        html = await fetch_html(url)
        search_data = await parse_search_results(html)
        return search_data
    except Exception as e:
        logger.error(f"Error searching IMDb: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/imdb/advanced-search')
async def search_imdb_advanced(request: Request):
    query = request.query_params.get('q', '')
    title_type = request.query_params.get('title_type')
    release_date = request.query_params.get('release_date')
    
    url = f'https://www.imdb.com/search/title/?title={query}'
    if title_type:
        url += f'&title_type={title_type}'
    if release_date:
        url += f'&release_date={release_date}'
    
    try:
        html = await fetch_html(url)
        search_data = await parse_search_results(html)
        
        search_datas = {
            'results': search_data
        }
        
        return search_datas
    except Exception as e:
        logger.error(f"Error in advanced search on IMDb: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/imdb/top250')
async def scrape_imdb_top_250():
    try:
        html = await fetch_html('https://www.imdb.com/chart/top/')
        movie_data = await parse_search_results(html)
        return movie_data
    except Exception as e:
        logger.error(f"Error scraping IMDb Top 250: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/imdb/toptv')
async def scrape_imdb_top_tv():
    try:
        url = 'https://www.imdb.com/chart/toptv/'
        html = await fetch_html(url)
        data = await parse_top_tv_shows(html)
        return data
    except Exception as e:
        logger.error(f"Error scraping IMDb Top TV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/imdb/tvmeter')
async def scrape_imdb_tvmeter():
    try:
        url = 'https://www.imdb.com/chart/tvmeter/'
        html = await fetch_html(url)
        data = await parse_search_results(html)
        return data
    except Exception as e:
        logger.error(f"Error scraping IMDb TV Meter: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="debug")

# uvicorn server:app --host 0.0.0.0 --port 8080 --reload
