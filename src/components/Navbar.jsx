import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.item}>Connect</Link>
      <Link to="/requests" style={styles.item}>Requests</Link>
      <Link to="/profile" style={styles.item}>Profile</Link>
      <Link to="/users" style={styles.item}>Users</Link>

    </nav>
  );
}

const styles = {
  nav: {
    padding: "12px",
    background:"#222",
    display: "flex",
    gap: "20px"
  },
  item: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px"
  }
};
