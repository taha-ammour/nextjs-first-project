import Link from 'next/link';
import styles from "./MovieC.module.css"

interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
}

const MovieCard = ({ id, title, poster }: MovieCardProps) => {
  return (
    <div className={styles['movie-card']}>
      <Link href={`/movies/${id}`}>
        <img src={poster} alt={title} />
        <h2>{title}</h2>
      </Link>
    </div>
  );
};

export default MovieCard;
