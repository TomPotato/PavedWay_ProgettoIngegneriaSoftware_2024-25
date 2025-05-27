class Validator {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    validateName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]{2,}$/u;
        return nameRegex.test(name);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]).{8,}$/;
        return passwordRegex.test(password);
    }

    validateDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
        const dateRegex2 = /^\d{4}-\d{2}-\d{2}/;

        return dateRegex.test(date) || dateRegex2.test(date);
    }

    validateNotification(notification) {
        const notificationRegex = /^[a-zA-ZÀ-ÿ0-9.,:;!?()'"“”‘’\- ]{1,100}$/u;
        return notificationRegex.test(notification);
    }
}

module.exports = new Validator();