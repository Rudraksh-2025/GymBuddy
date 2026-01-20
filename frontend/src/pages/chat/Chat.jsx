import { Box, TextField, IconButton, Typography, Stack, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAiChat } from "../../Api/Api";

const Chat = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

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

    return (
        <Box sx={{ p: 0, height: '89vh', display: "flex", flexDirection: "column" }}>
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
                            <Typography variant="body1">{m.text}</Typography>
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
                        <Box className="dot-typing" />

                    </Box>
                </Box>
            )}

            <Stack direction="row" spacing={1}>
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
                <IconButton onClick={sendMessage} sx={{ color: 'white' }} disabled={isPending}>
                    <SendIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default Chat;