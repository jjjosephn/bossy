module.export = {
   apps: [
      {
         name: "bossy",
         script: "npm",
         args: "run dev",
         env: {
            NODE_ENV: "development",
            ENV_VAR1: "environment-varaible"
         },

      }
   ]
}