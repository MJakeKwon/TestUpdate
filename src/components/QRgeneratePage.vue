<template>
    <div>
        <h1>머신 QR 로그인</h1>

        <!-- ✅ QR 코드 표시 -->
        <div v-if="qrCode">
            <img :src="qrCode" alt="QR 코드" />
            <p>이 QR 코드를 모바일 앱에서 스캔하세요.</p>
        </div>

        <!-- ✅ QR 코드 생성 버튼 -->
        <button @click="generateQRCode">QR 코드 생성</button>
    </div>
</template>

<script>
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

export default {
    data() {
        return {
            qrCode: null, // QR 코드 이미지 URL
            sessionToken: null, // 세션 토큰 (UUID)
        };
    },
    methods: {
        // ✅ 1️⃣ QR 코드 생성
        async generateQRCode() {
            this.sessionToken = uuidv4(); // ✅ UUID 기반 세션 토큰 생성
            const qrData = `sessionToken:${this.sessionToken}`; // ✅ QR 코드 데이터 (임시)

            try {
                this.qrCode = await QRCode.toDataURL(qrData); // ✅ QR 코드 생성
                console.log("✅ QR 생성 완료:", this.qrCode);
            } catch (err) {
                console.error("❌ QR 코드 생성 실패:", err);
            }
        }
    }
};
</script>

<style>
body {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
}

h1 {
    color: #333;
}

img {
    width: 200px;
    height: 200px;
    margin-top: 20px;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>