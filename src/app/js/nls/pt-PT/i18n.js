//Contents of my/nls/root/colors.js
define({
    
    "routes" : {
        
        // app
        "/projects": "/projetos",
        "*actions" : "*accoes",

        // content
        "/content/:page" : "/conteudo/:page",
        "/content/about" : "/conteudo/acerca",

        // users
        "/users" : "/utilizadores",
        "/users/login" : "/utilizadores/entrar",  
        "/users/signup" : "/utilizadores/registar"
            
    },
    
    content : {
        "acerca" : "about"  
    },
    
    page : {
        
        about : {
            
            title : "Acerca"
            
        }
        
    }
    
});
