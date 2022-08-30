import { ref } from "vue"
import { projectFirestore } from "@/firebase/config"

const useCheck = (collection) => {
    const error = ref(null)
    const loading = ref(false)
    const check = async (query) => {
        let collectionRef = projectFirestore.collection(collection).orderBy('createdAt').where(...query)
        error.value = null; loading.value = true;
        try {
            let results = []
            const res = await collectionRef.get()
            res.docs.forEach(doc => {
                doc.data().createdAt && results.push({ ...doc.data(), id: doc.id })
            })
            error.value = null; loading.value = false;
            return results
        } catch (err) {
            console.log(err.message);
            error.value = ""; loading.value = false;
        }


    }
    const checkWithId = async (id) => {
        console.log(id);
        let collectionRef = projectFirestore.collection(collection).doc(id)
        error.value = null; loading.value = true;
        try {
            const res = await collectionRef.get()
            error.value = null; loading.value = false;
            return res.data()
        } catch (err) {
            console.log(err.message);
            error.value = ""; loading.value = false;
        }


    }
    return { error, loading, check, checkWithId }
}
export default useCheck