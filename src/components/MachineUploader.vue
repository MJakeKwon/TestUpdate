<template>
    <div>
        <h2>운동 데이터 업로드</h2>

        <p v-if="statusMessage">{{ statusMessage }}</p>
        <button @click="sendData">운동 데이터 전송</button>

        <!-- 무게 입력 -->
        <input type="number" v-model="inputSetWeight" placeholder="운동 무게 입력 (kg)" />
        <button @click="saveSetWeight">무게 설정</button>

        <!-- 유저 ID 입력 -->
        <input type="text" v-model="inputUserId" placeholder="유저 ID 입력" />
        <button @click="saveUserId">유저 ID 설정</button>

        <!-- 운동 루틴 입력 -->
        <input type="text" v-model="inputRoutine" placeholder="운동 루틴 입력" />
        <button @click="saveRoutine">운동 루틴 설정</button>

        <!-- 휴식 시간 입력 -->
        <input type="number" v-model="inputRestTime" placeholder="휴식 시간 입력 (초)" />
        <button @click="saveRestTime">휴식 시간 설정</button>

        <!-- 상태값으로 저장된 정보 표시 -->
        <p>유저 ID: {{ userId }}</p>
        <p>운동 루틴: {{ routine }}</p>
        <p>휴식 시간: {{ restTime }}초</p>
        <p>운동 무게: {{ setWeight }}kg</p>

        <!-- 세트 파일 생성 버튼 -->
        <button @click="createSetFile">세트 파일 생성</button>

        <!-- 운동 데이터 업로드 버튼 -->
        <button @click="uploadAllSetFiles" :disabled="!userId || !routine || setNumber < 1">
            운동 데이터 업로드
        </button>

        <p v-if="uploadMessage">{{ uploadMessage }}</p>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import socket from "@/plugins/socket";

export default {
    data() {
        return {
            uploadUrl: "",
            filePath: "",
            inputUserId: "",  // ✅ 입력받는 유저 ID
            inputRoutine: "", // ✅ 입력받는 운동 루틴
            inputRestTime: "", // ✅ 입력받는 휴식 시간
            uploadMessage: "",
            isListening: false, // ✅ 중복 이벤트 방지
            inputSetWeight: "",  // ✅ 입력받는 운동 무게
            statusMessage: "",
        };
    },
    computed: {
        ...mapState(["userId", "routine", "setNumber", "setWeight", "restTime"]),
    },
    methods: {
        ...mapMutations(["setUserId", "setRoutine", "setSetWeight", "setRestTime", "incrementSetNumber"]),

        sendData() {
            console.log("📢 데이터 전송 요청 (Vue)");
            console.log("userId:", this.userId); // ✅ userId 확인

            socket.emit("sendData", { userId: this.userId, routineName: this.routine, setWeight: this.setWeight, restTime: this.restTime });

            // ✅ 디버깅: 서버로부터 응답을 올바르게 받는지 로그 추가
            socket.on("serverResponse", (response) => {
                console.log("📥 서버 응답 수신:", response);
                if (response.success) {
                    this.statusMessage = "✅ 데이터 저장 완료!";
                } else {
                    this.statusMessage = "❌ 전송 실패: " + response.message;
                }
            });
        },
        saveSetWeight() {
            if (!this.inputSetWeight || isNaN(this.inputSetWeight) || this.inputSetWeight <= 0) {
                this.uploadMessage = "❌ 무게를 올바르게 입력해주세요!";
                return;
            }
            this.setSetWeight(Number(this.inputSetWeight));
            this.uploadMessage = `✅ 무게 저장 완료: ${this.setWeight} kg`;
        },

        // ✅ 유저 ID 저장
        saveUserId() {
            if (!this.inputUserId.trim()) {
                this.uploadMessage = "❌ 유저 ID를 입력해주세요!";
                return;
            }
            this.setUserId(this.inputUserId.trim());
            this.uploadMessage = `✅ 유저 ID 저장 완료: ${this.userId}`;
        },

        // ✅ 운동 루틴 저장
        saveRoutine() {
            if (!this.inputRoutine.trim()) {
                this.uploadMessage = "❌ 운동 루틴을 입력해주세요!";
                return;
            }
            this.setRoutine(this.inputRoutine.trim());
            this.uploadMessage = `✅ 운동 루틴 저장 완료: ${this.routine}`;
        },

        // ✅ 휴식 시간 저장
        saveRestTime() {
            if (this.inputRestTime === "" || this.inputRestTime === null || isNaN(this.inputRestTime)) {
                this.uploadMessage = "❌ 휴식 시간을 올바르게 입력해주세요!";
                return;
            }
            const restTimeValue = Number(this.inputRestTime); // ✅ 숫자로 변환
            if (restTimeValue <= 0) {
                this.uploadMessage = "❌ 휴식 시간은 0보다 커야 합니다!";
                return;
            }

            this.setRestTime(restTimeValue); // ✅ Vuex에 저장
            this.uploadMessage = `✅ 휴식 시간 저장 완료: ${this.restTime} 초`;
        },

        //세트파일생성
        createSetFile() {
            if (!this.userId || !this.routine) {
                this.uploadMessage = "❌ 유저 ID, 루틴, 주차를 입력해주세요!";
                return;
            }

            this.incrementSetNumber(); // ✅ 세트 번호 증가
            console.log("📢 세트 파일 생성 요청 (Vue)", {
                userId: this.userId,
                routine: this.routine,
                setNumber: this.setNumber, // ✅ 증가된 세트 번호 확인
            });

            // ✅ 기존 이벤트 리스너 제거 후 다시 등록 (중복 방지)
            socket.off("set_file_created");
            socket.on("set_file_created", (data) => {
                console.log("📢 백엔드 응답 수신:", data);
                if (data.success) {
                    console.log(`✅ 파일 생성 완료: ${data.filePath}`);
                    this.uploadMessage = `✅ ${data.fileName} 생성 완료!`;
                } else {
                    console.error("❌ 파일 생성 실패:", data.error);
                    this.uploadMessage = "❌ 파일 생성 실패!";
                }
            });

            // ✅ 머신 백엔드에 파일 생성 요청
            socket.emit("create_set_file", {
                userId: this.userId,
                routine: this.routine,
                setNumber: this.setNumber, // ✅ Vuex에서 증가한 세트 번호 전달
            });
        },

        //모든 세트 파일 업로드
        uploadAllSetFiles() {
            socket.emit("upload_all_set_files", {
                userId: this.userId,
                routine: this.routine,
            });

            socket.on("upload_success", (data) => {
                console.log("📢 S3 업로드 성공:", data);
                this.uploadMessage = "✅ 모든 세트 파일이 S3에 업로드되었습니다.";
            });

            socket.on("upload_error", (error) => {
                this.uploadMessage = `❌ S3 업로드 실패: ${error.message}`;
            });
        },
    },
};
</script>