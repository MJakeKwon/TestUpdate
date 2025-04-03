<template>
    <div>
        <h1>머신 QR 로그인</h1>
        <p id="result"></p>
    </div>
</template>

<script>
const CLOUD_API_URL = process.env.VUE_APP_CLOUD_API_URL; // ✅ .env에서 가져온 QR 로그인 API URL
const API_KEY = process.env.VUE_APP_API_KEY; // ✅ .env에서 가져온 API 키

export default {
    data() {
        return {
            scannedQR: "", // QR 데이터 저장 변수
            qrData: "", // QR 스캐너가 입력한 데이터 저장
        };
    },
    mounted() {
        this.listenForQRScanner(); // ✅ QR 스캐너 입력 감지 시작
    },
    methods: {
        // ✅ 1️⃣ 외부 QR 스캐너 입력 감지
        listenForQRScanner() {
            const handleKeyDown = (event) => {
                if (event.key === "Enter") {
                    if (this.qrData.length > 0) {
                        this.scannedQR = this.cleanQRData(this.qrData);
                        console.log(`✅ 정제된 QR: ${this.scannedQR}`);
                        this.sendQR(this.scannedQR);
                        this.qrData = ""; // ✅ 입력값 초기화
                    }
                } else {
                    this.qrData += event.key; // ✅ QR 데이터 계속 추가
                }
            };

            window.addEventListener("keydown", handleKeyDown);
        },

        // ✅ 2️⃣ QR 코드 정제 함수 (Shift 제거)
        cleanQRData(qrString) {
            return qrString.replace(/Shift/g, ""); // ✅ Shift 키 문자열 제거
        },

        // ✅ 3️⃣ 서버로 QR 코드 전송하여 로그인 요청
        sendQR(qrToken) {
            console.log(`🚀 QR 로그인 요청: ${qrToken}`);

            fetch(CLOUD_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": API_KEY
                },
                body: JSON.stringify({ qrToken }) // ✅ QR 데이터 전송
            })
                .then(response => response.json())
                .then(data => {
                    console.log("✅ 서버 응답:", data);
                    document.getElementById("result").innerText = data.message || "로그인 성공!";
                })
                .catch(err => {
                    console.error("❌ 로그인 요청 실패:", err);
                    document.getElementById("result").innerText = "서버 오류 발생!";
                });
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

#result {
    margin-top: 20px;
    font-weight: bold;
}
</style>