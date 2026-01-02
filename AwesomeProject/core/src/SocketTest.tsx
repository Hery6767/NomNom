import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';

// ⚠️ Nếu dùng Android emulator → dùng 10.0.2.2
const SOCKET_URL = "http://10.0.2.2:3000";
// Nếu chạy trên device thật → đổi thành IP LAN: http://192.168.x.x:3000

export default function SocketTest() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to socket:", socket.id);
        });

        // 💬 Server gửi lại dữ liệu
        socket.on("pong_from_server", (msg) => {
            setMessage(msg);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendPing = () => {
        const socket = io(SOCKET_URL);
        socket.emit("ping_from_client", "Hello server, I'm RN app!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Socket.IO Test</Text>

            <Button title="Ping server" onPress={sendPing} />

            <Text style={styles.msg}>Server says: {message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 22,
        marginBottom: 20
    },
    msg: {
        marginTop: 30,
        fontSize: 18,
        color: 'green'
    }
});
