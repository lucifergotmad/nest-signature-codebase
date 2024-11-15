# NestJS Clean Architecture + MongoDB

I've compiled best practices from various articles in this **repository**. While I've drawn inspiration from these sources, feel free to comment on or modify any aspect to meet your individual requirements. All references and credits are provided in the **dedicated section**.

---

## Table of Contents

[Description](#description)

[Packages](#packages)

* [Nest JS](#nest-js)
* [Mongoose](#mongoose)
* [Passport](#passport)
* [Class Validator](#class-validator)
* [Helmet](#helmet)

[Security](#security)

* [JWT](#jwt)
* [Signature](#signature)

<!-- [Programming Principles](#programming-principles)
* [Single Responsibility](#single-responsibility)
* [YAGNI](#yagni)
* [KISS](#kiss) -->

[Architecture](#architecture)

[Explanation & Usage](#explanation--usage)

* [Installation](#installation)
* [Architecture Layer](#architecture-layer)
  * [MongoEntity](#mongoentity)
  * [Repository](#repository)
  * [Port](#port)
  * [Domain](#domain)
    * [DomainEntity](#domainentity)
    * [ValueObject](#valueobject)
    * [EntityMapper](#entitymapper)
  * [UseCase](#usecase)
  * [Controller](#controller)

* [References](#references)

---

## Description

This repository leverages NestJS as the core framework and Mongoose for MongoDB connectivity. It implements the Hexagonal Architecture and CQRS as its primary architectural approach. Additionally, Domain Entities facilitate value validation and code isolation.

## Packages

There are 5 Main Packages used in this repo:

* ### Nest JS

 NestJS is a Node.js framework that offers built-in support for TypeScript. As a strong advocate for TypeScript's type system, I appreciate this feature greatly.

* ### Mongoose

 Mongoose is a user-friendly MongoDB framework that simplifies common tasks, including connection management, data modeling, and schema validation.

* ### Passport

 I chose Passport as my authentication middleware for Node.js due to its flexibility and modularity, which are crucial for the project's needs.

* ### Class Validator

 I utilize the Class Validator package to automatically validate client-side input through defined Data Transfer Object (DTO) classes.

* ### Helmet

 Helmet is a popular npm package that helps prevent a range of well-known web vulnerabilities by setting appropriate HTTP headers. It is lightweight, easy to use, and offers a wide range of out-of-the-box protections.

## Security

This repository implements two-layered security, inspired by best practices observed in various Open API implementations.

* ### JWT

 This repository implements a robust JWT authentication. This project utilizes a two-token approach for authentication, employing both access tokens for regular API access and refresh tokens for obtaining new access tokens.

 ```json
 {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.EweZx6mu7vfkNRejMjpthlalhxXSXzrjU2h8rOnTxMI",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.cp2YSSsZyklaLXczi8L7kll_m8gMQahjxvfXTKdv2Ew"
 }
 ```

 This project employs two tokens with distinct functionalities and lifespan. Access tokens grant short-term authorization for API access, while refresh tokens facilitate the acquisition of new access tokens with a validity period of one day. Refresh Token Lifespan Rules:

* **Initial Refresh Token**: You receive a refresh token (Refresh Token 1) with a specific lifespan (1 day).
* **Using Refresh Token 1**: When you use Refresh Token 1 to get a new access token, you receive two things:
  * A new access token for immediate use.
  * A new refresh token (**Refresh Token 2**)
* **Refresh Token 1** Lifespan reduce to 3 hours
* Both **Refresh Token 1** and **Refresh Token 2** can be used to obtain new access tokens as long as they are within their respective lifespans.

    > Note: This dual refresh token approach with reduced lifespan mitigates potential technical issues associated with acquiring new refresh tokens.
    >
* ### Signature

 Signature validation is implemented in the header with API and secret keys. Imagine a signature like a secret password only you and the system know. So, a signature is like a secret password that helps verify your identity and keep things safe. Below is the example code for generating the signature code:

 ```typescript
  import { SHA256 } from 'crypto-js';

  computeSignature(
   apiKey: string,
   secretKey: string,
   accessToken: string,
   timestamp: string,
  ) {
   const payload = apiKey + secretKey + accessToken + timestamp;
   return SHA256(payload).toString();
  }
 ```

 The API Key and Secret Key will be explained in **Installation** section.

## Architecture

My primary architecture utilizes the **Hexagonal Architecture**. This choice ensures robust communication between modules, facilitating necessary changes without compromising functionality. Prior to adopting this approach, the absence of clear contracts between modules created significant difficulties in implementing even minor changes, such as function modifications.

My architecture further leverages the **Onion Architecture** pattern to achieve clear separation and isolation of code based on its behavior. This approach aligns with common practices employed by major clean architecture implementations.

Finally, I implemented the **CQRS pattern** to enhance code navigation based on behavior. This allows for effortless identification of both command and query code, facilitating maintenance and development.

## Explanation & Usage

### Installation
>
> Note: This repository requires NodeJS v16.20.0. If you encounter difficulties running it with other versions, consider utilizing nvm for a seamless switch or docker for containerized execution.

1. Installing Dependencies

```bash
npm install
```

2. Set Up **.env** File

```shell
MODE=< development|production >
PORT=< YOUR_PORT_NUMBER >
IS_SECURE=< 1 | 0 >

DB_CONNECTION_URI=< YOUR_DB_CONNECTION_URI >
JWT_SECRET_KEY=< YOUR_ACCESS_TOKEN_SECRET_KEY >
JWT_REFRESH_KEY=< YOUR_REFRESH_TOKEN_SECRET_KEY >
JWT_LIMIT=< YOUR_ACCESS_TOKEN_KEY_LIMIT >

API_KEY=< SIGNATURE_API_KEY >
SECRET_KEY=< SIGNATURE_SECRET_KEY >

THROTTLE_TTL=< YOUR_THROTTLE_TTL >
THROTTLE_LIMIT=< YOUR_THROTTLE_LIMIT >
```

> Tips: You can copy and paste file **.env.example** and rename to **.env** and change the value for instant setup. '|' means option, also remove the '<' and '>'

3. Run The App

```bash
# Run and Watch
npm run start:dev
# Only Run
npm run start
```

> If you want to build for production, use below command:

```bash
npm run build
```

4. Prepare Signature Script

> Refer to [Signature](#signature) section to make the signature code. if you use postman, use below script:

```javascript
const generateSignature = (apiKey, apiSecret, accessToken, timestamp) => {
    return CryptoJS.SHA256(apiKey + apiSecret + accessToken + timestamp).toString()
}

const timestamp = new Date().toISOString()

const apiKey = pm.collectionVariables.get("API_KEY")
const apiSecret = pm.collectionVariables.get("SECRET_KEY")
const accessToken = pm.collectionVariables.get("ACCESS_TOKEN") || ""

const hash = generateSignature(apiKey, apiSecret, accessToken, timestamp)
```

> You can use either **Headers** or **Query** to put the signature, Use Below format as an example:

```json
{
    "authorization": "Bearer ACCESS_TOKEN", //required for protected resource
    "signature": "SIGNATURE_CODE",
    "timestamp": "1970-01-01T00:00:00.000Z"
}
```

5. Happy Code!

## Architecture Layer
>
> Guided by the **YAGNI** principle, I employed **abstract base classes** to encapsulate core functionalities for key concepts like **DomainEntity**, **ValueObject**, and **EntityMapper**. This abstraction promotes flexibility and adaptability for future implementations without over-engineering unnecessary features.

* ### MongoEntity

    Simple class contains your mongodb model.

    ```typescript
    @Schema({ collection: 'tm_user' })
    export class UserMongoEntity extends BaseMongoEntity<typeof UserMongoEntity> {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    //...
    }
    ```

    > All entities extend **BaseMongoEntity** for consistent and convenient access to the document's **_id** within the type system.
    >
* ### Repository

    Class that contains all of your low level logic to your database.

    ```typescript
    @Injectable()
    export class UserRepository
    extends BaseRepository<UserMongoEntity, UserEntity>
    implements UserRepositoryPort
    {
    constructor(
        @InjectModel(UserMongoEntity.name) private userModel: Model<UserDocument>,
    ) {
        super(userModel, new UserMapper(UserMongoEntity));
    }

    // add new function here.
    }
    ```

    > notes: I've made a **BaseRepository**, so you can extends new **repository** and use some basic CRUD function without make it manually. Remember to define an **InterfacePort** for each repository. This promotes modularity and facilitates clean code management, especially as the project scales.
    >
* ### Port

    Port is basically an interface that hold function declaration as a contract for **UseCase** or **Controller** to use it.

    ```typescript
    export interface UserRepositoryPort
    extends BaseRepositoryPort<UserMongoEntity, UserEntity> {
    // add new declaration here. 
    }
    ```

    > Ensure your new port extends **BaseRepositoryPort** to leverage its base repository functionalities.
    >
* ### Domain

    This layer focus on Business Logic, such as validation value, domain entity modelling, and mapping the **DomainEntity** to **MongoEntity**

* ### DomainEntity

        Domain Entity is a class that focus to validation value. to make it easier see below code:

        ```typescript
        //...
        export class UserEntity extends Entity<UserProps> {
            //...
            private static hashUtil: HashService = new HashService();

            static async create(props: UserProps) {
                const hashPassword = await this.hashUtil.generate(props.password);

                return new UserEntity({
                    user_name: props.user_name,
                    role: props.role, // this props use value-object
                    password: hashPassword
                });
            }

            static async comparePassword(rawPassword: string, hashedPassword: string) {
                return await this.hashUtil.compare(rawPassword, hashedPassword);
            }
        }
        // ...
        ```

        > We can separate logic such as hashing value inside **DomainEntity**. I also use **ValueObject** here, don't worry we're gonna cover this up on the next point.

* ### ValueObject

        Value Object is a class that contains validation value for each properties of your model.

        ```typescript
        export class UserRole extends ValueObject<string> {
            //...
            protected validate({ value }: DomainPrimitive<string>) {
                const isRoleValid = this._getValidRole().find(
                    (role: string) => role === value,
                );
                if (!isRoleValid)
                    throw new BadRequestException('The User Role is not valid');
            }

            private _getValidRole() {
                return ['ADMIN', 'OWNER']; 
        }
        ```

        > Notes: Utilize **Value Objects** strategically, reserving them for sensitive data like email addresses and phone numbers. For other properties, maintaining their raw form may be sufficient.
        >
* ### EntityMapper

        Simple Class for mapping your Domain Entity to Mongo Entity.

        ```typescript
        export class UserMapper extends DbMapper<UserEntity, UserMongoEntity> {
            protected toMongoProps(
                entity: UserEntity,
            ): MongoEntityProps<UserMongoEntity> {
                const entityProps = entity.getPropsCopy();

                const mongoProps: MongoEntityProps<UserMongoEntity> = {
                ...entityProps,
                role: entityProps.role.value,
                };
                return mongoProps;
            }
        }
        ```

        > Focus on The **Level** property, represented as a Value Object, requires extraction before being used within the Mongo model.
        >
* ### UseCase

    UseCases are the core logic behind your API features, encompassing functions like data creation, updates, and transaction management. They leverage various components like DomainEntities, Repositories, and ValueObjects to achieve their functionalities. Refer to the code for a deeper understanding.

* ### Controller

    Standard classes leverage NestJS route decorators to establish mappings between **API routes** and corresponding **UseCases**.

* ## References

  * [KhalilSteemler - CQRS, Domain, and ValueObject Explanation](https://khalilstemmler.com/articles/)
  * [Pablo Martinez - Hexagonal Architecture](https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c)
  * [Royi Benita - Generic Repository NestJS](https://betterprogramming.pub/implementing-a-generic-repository-pattern-using-nestjs-fb4db1b61cce)
  * [NestJS Docs](https://docs.nestjs.com/)
  
* ## Author
  
  * [rizkyridwan-id](https://github.com/rizkyridwan-id)
  * [lucifergotmad](https://github.com/lucifergotmad)
