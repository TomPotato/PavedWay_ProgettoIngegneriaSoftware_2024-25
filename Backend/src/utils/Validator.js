class Validator {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    validateName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]+$/u;
        return nameRegex.test(name);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]).{8,}$/;;
        return passwordRegex.test(password);
    }
}

module.exports = new Validator();