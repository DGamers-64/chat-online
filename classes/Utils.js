export default class Utils {
    static limpiarIP(ip) {
        if (!ip) return "0.0.0.0"
        if (ip.startsWith("::ffff:")) {
            ip = ip.replace("::ffff:", "")
        } else if (ip === "::1") {
            ip = "127.0.0.1"
        }
        return ip
    }
}