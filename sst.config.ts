import { AstroSite, NextjsSite } from "sst";

export default {
    stacks(app) {
      app.stack(function Site({ stack }) {
        const landing = new AstroSite(stack, "Landing", {
          path: "apps/landing/"
        });
        
        const blog = new NextjsSite(stack, "Blog", {
          path: "apps/blog/"
        });
        
        const cms = new NextjsSite(stack, "CMS", {
          path: "apps/cms/"
        });
      });
    }
  };