import axios from "axios";

const axios_instance = axios.create({
    headers: {
        "Content-Type" : "application/json",
    },
})

axios_instance.interceptors.request.use(
    function(config){
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
);

axios_instance.interceptors.response.use(
    function(response){
        return response;
    },
    function(error){
        const originalConfig = error.config;
// 認証エラーまたは業務エラーの場合
        if (
            error.response &&
            error.response.status === 401 &&
            !originalConfig.retry
        ){
            // リフレッシュトークンを使ってリトライ
            originalConfig.retry = true;
            // ログイン処理の場合はリトライしない
            if (originalConfig.url === "/api/inventory/login/"){
                // PromiseオブジェクトのRejectedを即座に返却する
                return Promise.reject(error);
            }

            axios_instance
                .post("/api/inventory/retry", {"refresh": ""})
                .then((response) => {
                    return axios_instance(originalConfig);
                })
                .catch(function(error){
                    return Promise.reject(error);
                })

// 認証エラーまたは業務エラー以外の場合は、適切な画面に遷移
        } else if (error.response && error.response.status !== 422) {
            window.location.href = "/login";
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios_instance