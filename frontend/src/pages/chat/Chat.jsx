import { Box, TextField, IconButton, Typography, Stack, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAiChat } from "../../Api/Api";
import { chatPrompts } from '../../utils/chatPrompts'
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const Chat = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const location = useLocation();

    const { mutate, isPending } = useAiChat();

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages((p) => [...p, userMsg]);
        setInput("");

        mutate(input, {
            onSuccess: (res) => {
                setMessages((p) => [...p, { role: "ai", text: res.reply }]);
            },
        });
    };

    const sendPreset = (text) => {
        const userMsg = { role: "user", text };
        setMessages((p) => [...p, userMsg]);

        mutate(text, {
            onSuccess: (res) => {
                setMessages((p) => [...p, { role: "ai", text: res.reply }]);
            },
        });
    };

    useEffect(() => {
        if (location.state?.autoPrompt) {
            const text = location.state.autoPrompt;

            setMessages((p) => [...p, { role: "user", text }]);

            mutate(text, {
                onSuccess: (res) => {
                    setMessages((p) => [...p, { role: "ai", text: res.reply }]);
                },
            });
        }
    }, []);



    return (
        <Box sx={{ p: 0, height: '88vh', display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    mb: 1,
                    p: 1,
                }}
            >
                {messages.map((m, i) => (
                    <Box
                        key={i}
                        sx={{
                            mb: 2,
                            maxWidth: "100%",
                            display: 'flex',
                            justifyContent: m.role === "user" ? "end" : "flex-start",
                        }}
                    >
                        <Box sx={{
                            bgcolor: m.role === "user" ? "#6366F1" : "#374151", py: 1.5, px: 2, borderRadius: 5, color: "white",
                            maxWidth: '90%',
                            width: 'fit-content',

                        }}>
                            <Typography variant="body1" sx={{
                                whiteSpace: "pre-line",
                                lineHeight: 1.6,
                            }}
                            >{m.text}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            {/* Thinking Indicator */}
            {isPending && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                        ml: 1,
                    }}
                >
                    <Avatar sx={{ bgcolor: "#10B981", width: 28, height: 28 }}>
                        <SmartToyIcon fontSize="small" />
                    </Avatar>

                    <Box
                        sx={{
                            color: "#9CA3AF",
                            px: 2,
                            py: 1,
                            borderRadius: 5,
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        Thinking
                        <Box className="dot-typing" ml={1} />

                    </Box>
                </Box>
            )}

            {messages.length === 0 && (
                <Box sx={{ py: 2, px: 0 }}>
                    <Typography sx={{ color: "#9CA3AF", mb: 1 }}>
                        Try asking:
                    </Typography>

                    <Stack spacing={1}>
                        {chatPrompts.map((p, i) => (
                            <Box
                                key={i}
                                onClick={() => sendPreset(p.message)}
                                sx={{
                                    p: 1.5,
                                    borderRadius: "14px",
                                    bgcolor: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.15)",
                                    },
                                }}
                            >
                                {p.label}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}


            <Stack display={'flex'} alignItems={'flex-end'} direction="row" spacing={1}>
                <TextField
                    fullWidth
                    sx={{
                        input: { color: "white" },
                        "& .MuiInputBase-input::placeholder": {
                            color: "white",
                            opacity: 0.7,
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" },
                            "&:hover fieldset": { borderColor: "white" },
                            "&.Mui-focused fieldset": { borderColor: "white" },
                        },
                    }}
                    size="small"
                    placeholder="Ask about diet, workout..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <IconButton onClick={sendMessage} sx={{ color: 'white', px: 0 }} disabled={isPending}>
                    <SendIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default Chat;