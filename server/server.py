import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re  # Import the re module
import json
import time

app = Flask(__name__)
CORS(app)

def fetch_html(url, retries=3, backoff=2):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=10)  # Adjust timeout as needed
            response.raise_for_status()  # Raise an error for non-200 status codes
            return response.text
        except requests.RequestException as e:
            print(f'Attempt {attempt + 1} failed: {e}')
            if attempt < retries - 1:
                print(f'Retrying in {backoff ** attempt} seconds...')
                time.sleep(backoff ** attempt)
    raise RuntimeError(f'Failed to fetch HTML from {url} after {retries} attempts.')

def parse_search_results(html):
    soup = BeautifulSoup(html, 'html.parser')
    search_results = soup.find('ul', class_='ipc-metadata-list')
    if search_results:
        search = search_results.find_all('li')
        search_data = []
        for result in search:
            title_elem = result.a
            link_elem = result.a
            img_elem = result.img
            
            # Check if any of the required elements is missing
            if title_elem and link_elem and img_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                img_src = img_elem['src']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()  # Extracting movie ID using regex
                
                details_html = fetch_html(link)
                details_soup = BeautifulSoup(details_html,'html.parser')
                
                title_type = details_soup.find('script', type='application/ld+json')
                if title_type:
                    title_data = json.loads(title_type.string)
                    trailer_data = title_data.get('trailer', {})
                    genres = title_data.get("genre", [])
                    description = title_data.get("description", "")
                    rating_value = title_data.get("aggregateRating", {}).get("ratingValue", "")
                    rating_count = title_data.get("aggregateRating", {}).get("ratingCount", "")
                    release_date = title_data.get("datePublished", "")
                    runtime = title_data.get("duration", "")
                    if title_data["@type"] == "TVSeries":
                        episodes_data = title_data.get("episode")
                        if episodes_data:
                            episodes_info = {}
                            for episode in episodes_data:
                                season_num = episode.get("partOfSeason", {}).get("seasonNumber")
                                if season_num:
                                    episodes_info[season_num] = episodes_info.get(season_num, 0) + 1
                            seasons_info = [{"season": season, "episodes": episodes} for season, episodes in episodes_info.items()]
                        else:
                            seasons_info = []
                            
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'img_src': img_src, 
                            'id': movie_id,
                            'type': 'TV Series',
                            'trailer': trailer_data.get("embedUrl"),
                            'img_high': title_data.get("image"),
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                    else:
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'img_src': img_src, 
                            'id': movie_id, 
                            'type': 'Movie', 
                            'trailer':  trailer_data.get("embedUrl"), 
                            'img_high': title_data.get("image"),
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                else:
                    print("Error: Could not find title type information.")
            else:
                print("Error: Missing required elements for a search result.")
        return search_data
    else:
        raise RuntimeError("Couldn't find movie list on the page.")

def parse_search_results2(html):
    soup = BeautifulSoup(html, 'html.parser')
    search_results = soup.find('ul', class_='ipc-metadata-list')
    if search_results:
        search = search_results.find_all('li')
        search_data = []
        for result in search:
            title_elem = result.a
            link_elem = result.a
            img_elem = result.img
            
            # Check if any of the required elements is missing
            if title_elem and link_elem and img_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                
                img_src = img_elem['src']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()  # Extracting movie ID using regex
                
                details_html = fetch_html(link)
                details_soup = BeautifulSoup(details_html,'html.parser')
                
                title_type = details_soup.find('script', type='application/ld+json')
                
                if title_type:
                    title_data = json.loads(title_type.string)
                    trailer_data = title_data.get('trailer', {})
                    genres = title_data.get("genre", [])
                    description = title_data.get("description", "")
                    rating_value = title_data.get("aggregateRating", {}).get("ratingValue", "")
                    rating_count = title_data.get("aggregateRating", {}).get("ratingCount", "")
                    release_date = title_data.get("datePublished", "")
                    runtime = title_data.get("duration", "")
                    title = title_data.get("name", "")
                    
                    if title_data["@type"] == "TVSeries":
                        episodes_data = title_data.get("episode")
                        if episodes_data:
                            episodes_info = {}
                            for episode in episodes_data:
                                season_num = episode.get("partOfSeason", {}).get("seasonNumber")
                                if season_num:
                                    episodes_info[season_num] = episodes_info.get(season_num, 0) + 1
                            seasons_info = [{"season": season, "episodes": episodes} for season, episodes in episodes_info.items()]
                        else:
                            seasons_info = []
                            
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'img_src': img_src, 
                            'id': movie_id,
                            'type': 'TV Series',
                            'trailer': trailer_data.get("embedUrl"),
                            'img_high': title_data.get("image"),
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                    else:
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'img_src': img_src, 
                            'id': movie_id, 
                            'type': 'Movie', 
                            'trailer':  trailer_data.get("embedUrl"), 
                            'img_high': title_data.get("image"),
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                else:
                    print("Error: Could not find title type information.")
            else:
                print("Error: Missing required elements for a search result.")
               
        return search_data
    else:
        raise RuntimeError("Couldn't find movie list on the page.")


def parse_top250_movies(html):
    soup = BeautifulSoup(html, 'html.parser')
    movie_list = soup.find('ul', class_='ipc-metadata-list')
    if movie_list:
        movies = movie_list.find_all('li')
        movie_data = []
        
        for movie in movies:
            title_elem = movie
            link_elem = movie.a
            img_elem = movie.img
            
            # Check if any of the required elements is missing
            if title_elem and link_elem and img_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                img_src = img_elem['src']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()  # Extracting movie ID using regex
                movie_info = {'title': title, 'link': link, 'img_src': img_src, 'id': movie_id}
                movie_data.append(movie_info)
            else:
                print("Error: Missing required elements for a movie.")
        return movie_data
    else:
        raise RuntimeError("Couldn't find movie list on the page.")


def parse_tv_meter_chart(html):
    soup = BeautifulSoup(html, 'html.parser')
    search_results = soup.find('ul', class_='ipc-metadata-list')
    
    if search_results:
        search = search_results.find_all('li')
        search_data = []
        for result in search:
            title_elem = result.a
            link_elem = result.a
            
            # Check if any of the required elements is missing
            if title_elem and link_elem:
                title = title_elem.text.strip()
                link = 'https://www.imdb.com' + link_elem['href']
                movie_id = re.search(r'tt\d+', link_elem['href']).group()  # Extracting movie ID using regex
                
                details_html = fetch_html(link)
                details_soup = BeautifulSoup(details_html,'html.parser')
                
                title_type = details_soup.find('script', type='application/ld+json')
                
                if title_type:
                    title_data = json.loads(title_type.string)
                    trailer_data = title_data.get('trailer', {})
                    genres = title_data.get("genre", [])
                    description = title_data.get("description", "")
                    rating_value = title_data.get("aggregateRating", {}).get("ratingValue", "")
                    rating_count = title_data.get("aggregateRating", {}).get("ratingCount", "")
                    release_date = title_data.get("datePublished", "")
                    runtime = title_data.get("duration", "")
                    title = title_data.get("name", "")
                    
                    if title_data["@type"] == "TVSeries":
                        episodes_data = title_data.get("episode")
                        if episodes_data:
                            episodes_info = {}
                            for episode in episodes_data:
                                season_num = episode.get("partOfSeason", {}).get("seasonNumber")
                                if season_num:
                                    episodes_info[season_num] = episodes_info.get(season_num, 0) + 1
                            seasons_info = [{"season": season, "episodes": episodes} for season, episodes in episodes_info.items()]
                        else:
                            seasons_info = []
                            
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'id': movie_id,
                            'type': 'TV Series',
                            'trailer': trailer_data.get("embedUrl"),
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                    else:
                        search_data.append({
                            'title': title, 
                            'link': link, 
                            'id': movie_id, 
                            'type': 'Movie', 
                            'trailer':  trailer_data.get("embedUrl"), 
                            'genres': genres,
                            'description': description,
                            'rating_value': rating_value,
                            'rating_count': rating_count,
                            'release_date': release_date,
                            'runtime': runtime
                        })
                else:
                    print("Error: Could not find title type information.")
            else:
                print("Error: Missing required elements for a search result.")
               
        return search_data
    else:
        raise RuntimeError("Couldn't find TV meter chart on the page.")


@app.route('/imdb/search/<query>')
def search_imdb(query):
    
    # Build the URL based on the provided parameters
    url = f'https://www.imdb.com/find/?q={query}'
    
    try:
        html = fetch_html(url)
        search_data = parse_search_results(html)
        return jsonify(search_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/imdb/advanced-search')
def search_imdb_advanced():
    query = request.args.get('q', '')  # Get the 'q' parameter from the query string
    title_type = request.args.get('title_type')  # Get the 'title_type' parameter from the query string
    release_date = request.args.get('release_date')  # Get the 'release_date' parameter from the query string
    
    url = f'https://www.imdb.com/search/title/?title={query}'
    if title_type:
        url += f'&title_type={title_type}'
    if release_date:
        url += f'&release_date={release_date}'
    
    try:
        html = fetch_html(url)
        search_data = parse_search_results2(html)
        
        # Combine search data with the "See More" button
        search_datas = {
            'results': search_data
        }
        
        return jsonify(search_datas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/imdb/top250')
def scrape_imdb_top_250():
    try:
        html = fetch_html('https://www.imdb.com/chart/top/')
        movie_data = parse_top250_movies(html)
        return jsonify(movie_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/imdb/tvmeter')
def scrape_imdb_newTvshows():
    try:
        url = 'https://www.imdb.com/chart/tvmeter/'
        html = fetch_html(url)
        data = parse_tv_meter_chart(html)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)

#https://www.imdb.com/tr/?pt=advsearch&spt=title&ht={}&pageAction=sr-seemor