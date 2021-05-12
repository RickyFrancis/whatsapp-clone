import validURL from '../../utils/validURL';
import got from 'got';
import createMetascraper from 'metascraper';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperTitle from 'metascraper-title';
import metascraperUrl from 'metascraper-url';
import metascraperLogo from 'metascraper-logo';

const metascraper = createMetascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
  metascraperUrl(),
  metascraperLogo(),
]);

// @desc Get meta info of an url
// @route POST /api/meta/
// @access Public
export default async (req, res) => {
  try {
    const { msgURL } = req.body;

    if (validURL(msgURL)) {
      const { body: html, url } = await got(msgURL);

      const metadata = await metascraper({ html, url });

      res.json(metadata);
    } else {
      res.status(400);
      res.json('Invalid URL');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
