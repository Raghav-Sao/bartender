const app = require('./app');
const port = 3000;

app.listen(port, () => {
    console.log(`Bartender service running on port ${port}`);
});
