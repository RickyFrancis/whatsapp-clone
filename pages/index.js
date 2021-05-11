import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp Clone</title>
        <meta
          name="description"
          content="Whatsapp Clone built with nextjs and firebase by Ricky Francis Rozario"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  );
}
