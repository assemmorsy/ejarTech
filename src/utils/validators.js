import { helpers } from '@vuelidate/validators'
function arabicAlpha(string) {
    let regExp = /[\u0600-\u06FF]/g;
    return regExp.test(string)
}

function saudiId(info) {
    return helpers.withParams({ type: 'condition', value: info }, (string) => {
        if (info.value.isSaudi === "true") return /(1)\d{9}/g.test(string)
        else if (info.value.isSaudi === "false") return /(2)\d{9}/g.test(string)
        else return false
    })
}



function fileTypeImgOrPDF(file) {
    const FileTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    return FileTypes.includes(file.type)
}

function fileSize(file) {
    const TargetSize = 1e6;
    return file.size <= TargetSize
}

function requiredFile(file) {
    return file !== null
}
function genderRequired(gender) {
    return (gender === "ذكر" || gender === "انثى")
}

function societyStatusRequired(SocietyStatuses) {
    return helpers.withParams({ type: 'SocietyStatuses', value: SocietyStatuses }, (societyStatus) => {
        return SocietyStatuses.includes(societyStatus)
    })
}

function birthDayRange(date) {
    const Start = new Date("1920-1-1")
    const End = new Date("2020-1-1")
    const currentDate = new Date(date)
    return (currentDate >= Start && currentDate <= End)
}

function phoneNumber(string) {
    let reg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
    return reg.test(string)

}

function selectRequired(value) {
    return value !== ""
}

function selectRequiredInCondition(info) {
    return helpers.withParams({ type: 'condition', value: info }, (value) => {
        if (info.value.familyResidence) return value !== ""
        else return true
    })
}

function checkRequired(checkArray) {
    return checkArray.length > 0
}
export { selectRequiredInCondition, checkRequired, arabicAlpha, saudiId, fileTypeImgOrPDF, selectRequired, fileSize, requiredFile, birthDayRange, genderRequired, societyStatusRequired, phoneNumber }