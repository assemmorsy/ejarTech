import { projectAuth } from "@/firebase/config";
import { ref } from "vue"

const useLogin = () => {
    const error = ref(null)
    const loading = ref(false)
    const login = async (user) => {
        error.value = null
        loading.value = true
        try {
            const res = await projectAuth.signInWithEmailAndPassword(user.email, user.password)
            loading.value = false
            error.value = null
            return res
        } catch (err) {
            console.log(err.message);
            loading.value = false
            error.value = "تأكد من صحة البريد الالكترونى وكلمة المرور"
        }
    }
    return {
        error, loading, login
    }
}

export default useLogin