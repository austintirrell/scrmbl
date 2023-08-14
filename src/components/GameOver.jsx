import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from 'framer-motion';
import ScrmblStyledWord from "./ScrmblStyle";

const GameOverContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000000dd;
  z-index: 100;
`;

const InfoContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  border-radius: 25px;
  margin: auto;
  width: 500px;
  box-shadow: 0 0 10px #00000022;
  border: 2px solid #ffffff;
`;

const Heading = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin: 16px;
  border-bottom: 2px solid #ffffff;
`;

const List = styled.ul`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 16px;
  width: 80%;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
`;

const ListItem = styled.li`
  text-align: center;
  list-style: none;
  font-weight: 400;
  margin: 8px 0;
  width: 200px;
`;

const ShareButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #dfba3c;
  color: #000000;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 25px;
  padding: 8px 16px;
  margin: 16px;
  cursor: pointer;
  box-shadow: 0 0 10px #00000022;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px #00000022;
  }
`;

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  border-radius: 10px;
  margin: 16px;
  width: 100%;
`;

const Stat = styled.span`
  font-size: 64px;
  font-weight: 700;
  background: ${props => props.background || '#000000'};
  padding: 8px 16px;
  border-radius: 10px;
  color: #000000;
  margin: 8px;
`;

const GameOver = ({ active, word, scrmblsLeft, elapsedSeconds }) => {
  const [correctArray, setCorrectArray] = useState([]);
  const [buttonText, setButtonText] = useState("Share");

  const generateShareString = () => {
    let emojiForScrmbls;
    if (scrmblsUsed === 0) emojiForScrmbls = "🌟";
    else if (scrmblsUsed <= 2) emojiForScrmbls = "😊";
    else emojiForScrmbls = "😓";
  
    let emojiForTime;
    if (elapsedSeconds <= 30) emojiForTime = "🚀";
    else if (elapsedSeconds <= 60) emojiForTime = "🏃";
    else emojiForTime = "🐢";
    return `I guessed today's Scrmbl in ${elapsedSeconds}s ${emojiForTime} and used the Scrmbl button ${scrmblsUsed} times ${emojiForScrmbls}! Can you beat me? https://scrmbl.net`;
  };

  const handleShareClick = () => {
    const shareString = generateShareString();
    if (navigator.share) {
      navigator.share({
        title: 'My game stats',
        text: shareString,
        url: 'http://yourgameurl.com',
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareString).then(() => {
        setButtonText("Copied!");
        setTimeout(() => setButtonText("Share"), 3000);
      }).catch(console.error);
    }
  };
  
  const scrmblsUsed = 3 - scrmblsLeft;

  useEffect(() => {
    const indexArray = Array.from({ length: word.length }, (_, i) => i);
    setCorrectArray(indexArray);
  }, [word]);

  return (
    <AnimatePresence>
      {active && 
      <GameOverContainer
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <InfoContainer>
          <Heading>You guessed it!</Heading>
          <List>
            <ScrmblStyledWord text={word} size='32px' correct={correctArray} />
            <Heading>Here's how you did:</Heading>
            <StatContainer>
              <ListItem>Times you used the Scrmbl button</ListItem>
              <Stat background={
                scrmblsUsed === 0 ? '#aaf683' :
                scrmblsUsed <= 2 ? '#dfba3c' :
                '#ee6055'
              }>{scrmblsUsed}</Stat>
            </StatContainer>
            <StatContainer>
              <ListItem>Seconds it took you to guess the word</ListItem>
              <Stat background={
                elapsedSeconds <= 30 ? '#aaf683' :
                elapsedSeconds <= 60 ? '#dfba3c' :
                '#ee6055'
              }>{elapsedSeconds}</Stat>
            </StatContainer>
            <ShareButton onClick={handleShareClick}>{buttonText}</ShareButton>
          </List>
        </InfoContainer>
      </GameOverContainer>}
    </AnimatePresence>
  );
};

export default GameOver;