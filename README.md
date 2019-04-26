![conexus](https://www.conex.us/images/conexus-black.png "conex.us")
# Conexus
## [Wiki](wiki)
## Create A Transparent Network
> Connect Collab Create

```
// in "/path/to/folder" copy https://pastebin.com/JfQtY8hw as geneis.json 
geth --datadir="/path/to/folder" init genesis.json
geth --datadir="/path/to/folder" --networkid="88888888" console
admin.addPeer("enode://4c9ec1b929cb995a9fb174968c4fed4627cecdecfdde080af6a8fdbf9600062fbafc79ef4d92b3617b9e8d7b49bb1255e7066a27923f48ce81cfead8a61063f7@54.212.193.239:30302")
admin //to see if peers connected
miner.start(1)
```
[download](https://peer.cre8.xyz)

## ERC-888
[gist](https://gist.github.com/troverman/809dba32d8510e7713aaa5c869e607ae) | [EIP](https://github.com/ethereum/EIPs/issues/888)
> Token data-structures with balances specified by unique identifiers create emergent properties within cryptoeconomic systems that introduce valuable approaches to mechanism design and contract development.
```
contract MultidimensionalToken {
    mapping (address => mapping (string => uint)) balances;
    event Transfer(address indexed _from, address indexed _to, string indexed _id, uint256 _value);
    
    function balanceOf(address _owner, string _id) constant returns (uint256 balance) {
        return balances[_owner][_id];
    }

    function transfer(address _to, string _id, uint256 _value) returns (bool success) {
        if (balances[msg.sender][_id] >= _value && _value > 0) {
            balances[msg.sender][_id] -= _value;
            balances[_to][_id] += _value;
            Transfer(msg.sender, _to, _id, _value);
            return true;
        } 
        else {return false;}
    }
}
```

## [API](https://www.cre8.xyz/developers)
### Filters
```javascript
var query = [{
    filter:[{
        model:'Association, Task, Project',
        modelParam:'association, id, location, query, tag, ...',
        query:'query',
        association:{
            population:'boolean',
            depth:'integer',
        },
        params:{
            limit:'integer',
            skip:'integer',
            sort:'modelParam sortParam',
        },
        chain:'logic [\'AND\',\'OR\']',
    }],
    params:{
        limit:'integer',
        skip:'integer',
        sort:'modelParam sortParam',
    },
    chain:'logic [\'AND\',\'OR\']'
}]
```

### Models | Endpoints

#### Assoication
> This is the Association Model
```javascript
var associationModel = {

};
```
> get /api/assoication
> post /api/assoication

#### Content
> This is the Content Model
```javascript
var contentModel = {
    id: idObj,
    title: string,
    content: string,
    tags: string,
    type: string, //AUDIO, LINK, IMAGE, POST, VIDEO
    location: locationObj,
    associatedModels: associationObj,
    reactions: reactionObj,
    user: userObj
};
```
> get /api/content
> post /api/content

#### Follower
> This is the Follower Model
```javascript
var followerModel = {
    id: idObj,
    followed: userObj,
    follower: userObj
};
```
> get /api/follower
> post /api/follower

#### Item
> This is the Item Model
```javascript
var itemModel = {
    id: idObj,
    title: string,
    content: string,
    tags: string,
    associatedModels: associationObj,
    location: locationObj,
    info:infoObj, //FORSALE, DELIVERY PROTOCOLS
    identifierSet: string,
    amountSet: string,
    reactions: reactionObj,
    user: userObj
};
```
> get /api/item
> post /api/item

#### Location
> This is the Location Model
```javascript
var location = {
    id: idObj,
    address: string,
    lat: string,
    lng: string
};
```
> get /api/location
> post /api/location

#### Motion
> This is the Motion Model
```javascript
var motionModel = {

};
```
> get /api/motion
> post /api/motion

#### Notification
> This is the Notification Model
```javascript
var notificationModel = {
    id: idObj,
    content:string,
    user: userObj
};
```
> get /api/notification

#### Order
> This is the Order Model
```javascript
var orderModel = {
    type: string,
    amountSetAlpha: obj,
    amountSetBeta: obj,
    status: string,
    reactions: reactionObj,
    user: userObj
};
```
> get /api/order
> post /api/order

#### Passport
> This is the Passport Model
```javascript
var passportModel = {
    protocol: alphanumeric,
    provider: alphanumericdashed,
    identifier: string,
    tokens: obj,
    user: userObj
};
```
> get /api/passport
> post /api/passport

#### Project
> This is the Project Model
```javascript
var projectModel = {
    title: string,
    description: string,
    avatarUrl: string,
    tags: string,
    location: locationObj,
    associatedModels: obj,
    //parent: projectObj,
    info: infoObj,
    user: userObj
};
```
> get /api/project
> post /api/project

#### ProjectMember
> This is the ProjectMember Model
```javascript
var projectMemberModel = {
    project: projectObj,
    user: userObj
};
```
> get /api/projectmember
> post /api/projectmember

#### Reaction
> This is the Reaction Model
```javascript
var reactionModel = {
    amount: string,
    type: string,
    associatedModels: obj,
    reactions: reactionObj,
    user: userObj
};
```
> get /api/reaction
> post /api/reaction

#### Task
> This is the Task Model
```javascript
var taskModel = {
    title: string,
    content: string,
    location: locationObj,
    tags: string,
    associatedModels: obj,
    reactions: reactionObj,
    user: userObj //CREATOR
};
```
> get /api/task
> post /api/task

#### Time
> This is the Time Model
```javascript
var timeModel = {
    task: taskObj,
    id: idObj,
    time: integer,
    user: userObj
};
```
> get /api/time
> post /api/time

#### Token
> This is the Token Model
```javascript
var tokenModel = {
    string: string,
    protocols: obj,
    logic: obj,
    info: infoObj
};
```
> get /api/token
> post /api/token

#### Transaction
> This is the Transaction Model
```javascript
var transactionModel = {
    amountSet: obj, //{assetIdentifer, amount}
    to: string,
    from: string,
    content: string,
    tags: string,
    reactions: reactionObj,
    user: userObj //CREATOR
};
```

```javascript
amountSet = {
    'ASSETALPHA': AMOUNTALPHA,
    'ASSETBETA': AMOUNTBETA,
    'ASSETGAMMA': AMOUNTGAMMA,
    ...
}
```

> get /api/transaction
> post /api/transaction

#### User
> This is the User Model
```javascript
var userModel = {
    avatarUrl: string,
    createdAt: dateObj,
    email: string,
    id: idObj,
    passports: [passpostObj]
    title: string,
    username: string,
    walletAddress: string
};
```
> get /api/user
> post /api/user

#### Validation
> This is the Validation Model
```javascript
var validationModel = {
    content: string,
    reputation: obj,
    validation: obj,
    associatedModels: obj,
    user: userObj
};
```
> get /api/validation
> post /api/validation