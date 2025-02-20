import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import EditMovieForm from "./components/EditMovieForm";
import MovieHeader from "./components/MovieHeader";
import AddMovieForm from "./components/AddMovieForm";
import FavoriteMovieList from "./components/FavoriteMovieList";

import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id) => {
    console.log("beni sil", id);

    const movie = movies.find((movie) => movie.id === id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete ${movie.title}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", `${movie.title} has been deleted.`, "success");
        axios
          .delete(`http://localhost:9000/api/movies/${id}`)
          .then((res) => {
            console.log("DELETE", res);
            // setMovies(movies.filter((movie)=> movie.id !== id));
            setMovies(res.data); //API bize kalan bütün filmleri döndüğü için setMovies ile güncelleyebiliriz.
            setFavoriteMovies(
              favoriteMovies.filter((movie) => movie.id !== id)
            );
            push("/movies");
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    });
  };

  const addToFavorites = (movie) => {
    console.log("favorilere ekle", movie);

    if (!favoriteMovies.find((favMovie) => favMovie.id === movie.id)) {
      setFavoriteMovies([...favoriteMovies, movie]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Already added to favorites!",
      });
    }
  };

  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>
            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                addToFavorites={addToFavorites}
                deleteMovie={deleteMovie}
                setFavoriteMovies={setFavoriteMovies}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
