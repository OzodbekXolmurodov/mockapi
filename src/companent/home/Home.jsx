import React from "react";
import "./Home.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";

const Home = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users"),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (body) => api.post("/users", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData);
    body.isMarried = body.isMarried === "married";
    addUserMutation.mutate(body, {
      onSuccess: () => {
        e.target.reset();
      },
    });
    console.log(body);
  };

  return (
    <div className="main-bg">
      <div className="form-container">
        <form onSubmit={handleSubmit} action="" className="form-flex">
          <input name="name" type="text" placeholder="Name" className="input" />
          <input name="age" type="number" placeholder="Age" className="input" />
          <select name="isMarried" className="input">
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
          <input
            name="image"
            type="text"
            placeholder="Image URL"
            className="input"
          />
          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </div>

      <div className="users-list">
        {data?.data.map((user) => (
          <div key={user.id} className="user-card">
            <h2 className="user-name">{user.name}</h2>
            <img src={user.image} alt="rasim" className="user-img" />
            <p className="user-age">
              Age: <span className="user-age-value">{user.age}</span>
            </p>
            <p className="user-status">
              {user.isMarried ? "Married" : "Single"}
            </p>
            <button
              onClick={() => handleDelete(user.id)}
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
