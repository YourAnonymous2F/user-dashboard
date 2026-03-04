import { useState, useEffect } from "react";

function UserDashboard() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = input.trim();
      if (trimmed) {
        setUsername(trimmed);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    if (!username) return;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        setUser(null);
        setPosts([]);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?username=${username}`
        );

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const data = await response.json();

        if (data.length === 0) {
          throw new Error("User not found");
        }

        const foundUser = data[0];
        setUser(foundUser);

        setRecent((prev) => {
          const updated = [
            username,
            ...prev.filter((u) => u !== username),
          ];
          return updated.slice(0, 5);
        });

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [username]);

  const fetchPosts = async () => {
    if (!user) return;

    try {
      setPostLoading(true);
      setError(null);

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch posts (${response.status})`);
      }

      const data = await response.json();
      setPosts(data);

    } catch (err) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div>
        <div style={{
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 10px'
        }}>
            <h2>User Dashboard</h2>
            <input
                type="text"
                placeholder="Search username"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    padding: '5px',
                    outline: 'none', 
                    border: 'none',
                    borderRadius: '5px'
                }}
            />
        </div>
      

        <p style={{color: 'red'}}>Hint on names to try: Samantha, Bret, Antonette, Karianne, Kamren, Leopoldo_Corkery, Elwyn.Skiles, Maxime_Nienow,    Delphine, Moriah.Stanton</p>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {user && (
        <div style={{ marginTop: "20px", border: "2px solid green", padding: "15px" }}>
          <h3>Username: {user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Company: {user.company.name}</p>

          <button onClick={fetchPosts}>
            {postLoading ? "Loading posts..." : "Load Posts"}
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Posts</h3>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      )}

      {recent.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Recently Viewed</h3>
          <ul>
            {recent.map((u, index) => (
              <li key={index}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserDashboard