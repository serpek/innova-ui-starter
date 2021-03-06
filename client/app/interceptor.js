'use strict';

// Workaround for not losing the this binding in methods
let self;

class HttpInterceptor {
    constructor($rootScope, $location, $q, Config, AuthService) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$q = $q;
        this.Config = Config;
        this.authService = AuthService;

        this.API_LOGIN_URL = `${Config.apiBase}/login`;

        self = this;
    }

    request(config) {
        var canceller,
            urlCheck = config.url.search(self.Config.apiBase) !== -1;

        if (self.authService.isAuthenticated()) {
            config.headers.Authorization = `Token ${self.authService.getCredentials().token}`;
        } else if (urlCheck && config.url !== self.API_LOGIN_URL) {
            canceller = self.$q.defer();
            config.timeout = canceller.promise;
            canceller.resolve(`Cancelled request to ${config.url} because we do not have credentials`);
            self.authService.cleanCredentials();
            self.$location.url('/login');
        }
        return config;
    }

    requestError(config) {
        // console.log("httpInterceptor -> requestError");
        return config;
    }

    response(res) {
        // console.log("httpInterceptor -> response");
        return res;
    }

    responseError(rejection) {
        if (rejection.config.url.search(self.Config.apiBase) !== -1 && rejection.status === 401) {
            // TODO: redirect parameter for login
            self.authService.cleanCredentials();
            self.$location.url('/login');
        }
        return self.$q.reject(rejection);
    }

    static factory($rootScope, $location, $q, Config, AuthService) {
        return new HttpInterceptor($rootScope, $location, $q, Config, AuthService);
    }
}

HttpInterceptor.factory.$inject = ['$rootScope', '$location', '$q', 'Config', 'AuthService'];

export default HttpInterceptor.factory;