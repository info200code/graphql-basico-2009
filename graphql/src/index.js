import { ApolloServer, gql } from "apollo-server";
import faker from "faker";

const data = [
  {
    id: 1,
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    profile: 1, // client
    estado: 1 // activo
  },
  {
    id: 2,
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    profile: 2, // empleado
    estado: 2 // inactivo
  },
];

const clientes = [
  {
    direccion: faker.random.words(),
    codigoPostal: 123,
    userId: 1
  }
]

const empleados = [
  {
    email: faker.internet.email(),
    telefono: faker.phone.phoneNumber(),
    userId: 2
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    profile: UserProfile!
    estado: EstadoUsuario
    data: UsuarioData
  }

  union UsuarioData = Cliente | Empleado

  type Cliente {
    direccion: String # cliente
    codigoPostal: String # cliente
  }

  type Empleado {
    email: String # empleado
    telefono: String # empleado
  }

  enum UserProfile {
    CLIENTE
    EMPLEADO
  }

  enum EstadoUsuario {
    ACTIVO
    INACTIVO
  }

  type Query {
    hello: String!
    users: [User!]!
    user(id: ID): User!
  }

  input UserInput {
    id: ID
    name: String!
    lastName: String!
    email: String
  }

  type Mutation {
    saveUser(user: UserInput!): User!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world",
    users: () => data,
    user: (info, args, context) =>
      data.find((item) => parseInt(item.id) === parseInt(args.id)),
  },
  Mutation: {
    saveUser: (info, args, context) => {
      data.push(args.user)
      return data[data.length - 1]
    }
  },
  User: {
    firstName: (info, args, context) => {
      return info.name
    },
    fullName: (info) => {
      return info.name + ' ' + info.lastName
    },
    data: (info, args, context) => {
      let data = null  
      if(info.profile === 1) {
          data = clientes.find(client => client.userId === info.id)
        } else if (info.profile === 2) {
          data = empleados.find(empleado => empleado.userId === info.id)
        }

        return data
    }
  },
  UserProfile: {
    CLIENTE: 1,
    EMPLEADO: 2 
  },
  EstadoUsuario: {
    ACTIVO: 1,
    INACTIVO: 2
  },
  UsuarioData: {
    __resolveType: (info, args, context) => {
      if (info.codigoPostal) {
        return "Cliente"
      }

      if (info.telefono) {
        return "Empleado"
      }

      return null
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server corriendo en ${url}`);
});
