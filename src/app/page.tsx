import Map from './Map';
import styles from './page.module.css'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Map />
    </main>
  )
}
