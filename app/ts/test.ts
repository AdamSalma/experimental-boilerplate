export module Test {
    
  export class Something {
    $router: any;
    
    constructor($router) {
      this.$router = $router;

      $router.config([
        { path: '/', component: 'home' }
      ]);
    }
    
  }
  
 
}

