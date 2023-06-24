import Map from "./components/Map";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <main className={styles.main}>
      <Map />
    </main>
  );
}
