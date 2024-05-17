# Important commands

After pulling from origin, migrate to sync changes to your local db

```
npm run migrate
```

Also after you change the model schemas, you have to run it

<br/>

### Use prisma from `db/db.ts`

Its a singleton obj, so you don't run into any issue
Then you can access models using `prisma.users....`
