import { projectStorage } from "@/firebase/config";
import { ref } from "vue"
const useStorage = () => {
    const error = ref(null)
    const loading = ref(false)
    const url = ref(null)
    const filePath = ref(null)
    const uploadFile = async (phoneNum, file) => {
        error.value = null; loading.value = true
        let unique = new Date().toJSON().replace(/:/g, "")
        filePath.value = `files/${phoneNum}/${unique + file.name}`
        const storageRef = projectStorage.ref(filePath.value)
        try {
            const res = await storageRef.put(file)
            url.value = await res.ref.getDownloadURL()
            error.value = null; loading.value = false

        } catch (err) {
            console.log(err);
            error.value = "تعثر حفظ الملف  برجاء المحاولة مرة اخرى"; loading.value = false

        }
    }
    return { error, loading, uploadFile, filePath, url }
}
export default useStorage