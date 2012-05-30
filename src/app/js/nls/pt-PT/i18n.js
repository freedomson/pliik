//Contents of my/nls/root/colors.js
define({
    
    "routes" : {
        
        // app
        "/projects": "/projetos",
        "*actions" : "*accoes",

        // content
        "/content/:page" : "/conteudo/:page",
        "/content/opensource" : "/conteudo/codigolivre",

        // users
        "/users" : "/utilizadores",
        "/users/login" : "/utilizadores/entrar",  
        "/users/signup" : "/utilizadores/registar"
            
    },
    
    content : {
        "codigolivre" : "opensource"  
    }
    
});
