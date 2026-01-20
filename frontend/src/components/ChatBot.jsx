import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import chatBot from '../assets/images/chatbot.gif'

const ChatBot = () => {
    const nav = useNavigate();

    return (
        <Button
            p={0}
            onClick={() => nav("/home/chat")}
        >
            <img src={chatBot} alt="" style={{ width: 50, height: 50 }} />
        </Button>

    );
};

export default ChatBot;