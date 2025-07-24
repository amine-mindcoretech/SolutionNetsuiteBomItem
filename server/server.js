
//server.js


// server.js

const express = require('express');
const cors = require('cors'); 
const routesBom = require('./routes/bomRoutes');
const routesBomrevision = require('./routes/bomRevisionRoutes');
const suiteqlRoutes = require('./routes/itemSuiteqlRoutes'); 
const assemblyRoutes = require('./routes/assemblySuiteqlRoutes');
const bomSuiteqlRoutes = require('./routes/bomSuiteqlRoutes');
const bomAssemblyRoutes = require('./routes/bomAssemblyRoutes');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;



app.use('/api/bom', routesBom);
app.use('/api/bom-revision', routesBomrevision);
app.use('/api/suiteql', suiteqlRoutes); 
app.use('/api/assemblies', assemblyRoutes);
app.use('/api/boms', bomSuiteqlRoutes); 
app.use('/api/bom-assembly', bomAssemblyRoutes);
app.use('/api/users', authRoutes);
app.use('/api/item', itemRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

