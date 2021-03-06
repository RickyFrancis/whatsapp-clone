import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState, useEffect } from 'react';
import firebase from 'firebase';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import { ThreeBounce } from 'better-react-spinkit';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const endOfMessagesRef = useRef(null);
  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );
  const [recipientsSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    router.events.on('routeChangeStart', () => scrollToBottom());
    router.events.on('routeChangeComplete', () => scrollToBottom());
    router.events.on('routeChangeError', () => scrollToBottom());
  }, []);

  const sendMessage = (e, data) => {
    e.preventDefault();

    // Update last seen
    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const isFileImage = (data) => {
      return data && data.startsWith('data:image/') ? true : false;
    };

    if (data && data.length > 0 && isFileImage(data)) {
      db.collection('chats').doc(router.query.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: data,
        user: user.email,
        photoURL: user.photoURL,
      });
    } else if (data && data.length > 0 && !isFileImage(data)) {
      alert('Only image files are allowed!');
    } else {
      db.collection('chats').doc(router.query.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      });
    }

    setInput('');
    scrollToBottom();
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input.concat(emoji));
  };

  const showEmojiContainer = (e) => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const recipient = recipientsSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientsSnapshot ? (
            <p>
              Last Active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <ThreeBounce
              color="#3CBC28"
              size={5}
              style={{ marginLeft: '5px' }}
            />
          )}
        </HeaderInformation>
        <HeaderIcons>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={(e) =>
              getBase64(e.target.files[0]).then((data) => {
                sendMessage(e, data);
              })
            }
          />
          <label htmlFor="icon-button-file">
            <IconButton aria-label="attach files" component="span">
              <AttachFileIcon />
            </IconButton>
          </label>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer
        onClick={(e) => {
          setShowEmojiPicker(false);
        }}
      >
        {showMessages()}

        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainerParent>
        <Picker
          onSelect={addEmoji}
          style={!showEmojiPicker ? { display: 'none' } : {}}
        />
        <InputContainer>
          <IconButton
            onClick={(e) => {
              showEmojiContainer(e);
            }}
          >
            <InsertEmoticonIcon />
          </IconButton>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message and press enter to send"
          />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send Message
          </button>
          <MicIcon />
        </InputContainer>
      </InputContainerParent>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin: 0;
  }
  > p {
    font-size: 14px;
    color: gray;
    margin: 0;
  }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.span`
  margin-bottom: 60px;
`;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const InputContainerParent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
