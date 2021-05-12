import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles({
  root: {
    width: 600,
    marginTop: 10,
    marginBottom: 10,
  },
  media: {
    height: 338,
  },
});

const MetaContent = ({ url }) => {
  const classes = useStyles();

  const [meta, setMeta] = useState({});

  const [showCard, setShowCard] = useState(true);

  const config = {
    'Content-Type': 'application/json',
  };

  const bodyData = {
    msgURL: url,
  };

  useEffect(() => {
    const fetchMeta = async () => {
      const { data } = await axios.post('/api/meta', bodyData, config);
      setMeta(data);
    };

    fetchMeta();
  }, []);

  if (meta) {
    return (
      <Card
        className={classes.root}
        style={showCard ? {} : { display: 'none' }}
        variant="outlined"
      >
        <CardMedia
          className={classes.media}
          image={meta.image}
          title={meta.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {meta.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {meta.description}
          </Typography>
        </CardContent>

        <CardActions>
          <IconButton
            color="secondary"
            onClick={(e) => setShowCard(false)}
            style={{ padding: '5px' }}
          >
            <CancelIcon />
          </IconButton>
          <Button
            size="small"
            color="primary"
            href={url}
            target="_blank"
            rel="noopener"
            style={{ padding: '5px' }}
          >
            Visit &nbsp; <LaunchIcon />
          </Button>
        </CardActions>
      </Card>
    );
  } else return <div>Loading...</div>;
};

export default MetaContent;
