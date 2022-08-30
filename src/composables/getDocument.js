import { ref, watchEffect } from "vue"
import { projectFirestore } from "@/firebase/config"

const getDocument = (collection) => {
    const error = ref(null)
    const docs = ref(null)
    const getDoc = async (query) => {


        let collectionRef = projectFirestore.collection(collection).orderBy('createdAt')
        if (query) {
            collectionRef = collectionRef.where(...query);
        }
        const unsub = collectionRef.onSnapshot(snap => {
            let results = []
            snap.docs.forEach(doc => {
                // must wait for the server to create the timestamp & send it back
                doc.data().createdAt && results.push({ ...doc.data(), id: doc.id })
            });

            // update values
            docs.value = results
            error.value = null

        }, err => {
            console.log(err.message)
            docs.value = null
            error.value = 'حدث عطل برجاء اعادة المحاولة'
        })

        watchEffect((onInvalidate) => {
            onInvalidate(() => unsub());
        });
    }
    return { error, docs, getDoc }

}
export default getDocument