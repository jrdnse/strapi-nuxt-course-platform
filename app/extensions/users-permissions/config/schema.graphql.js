const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
  if (_.get(contextBody, "statusCode", 200) !== 200) {
    const message = _.get(contextBody, "error", "Bad Request");
    const exception = new Error(message);
    exception.code = _.get(contextBody, "statusCode", 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  definition: /* GraphQL */ `
    type examResults {
      score: String
      passed: Boolean
      passedOnTime: Boolean
      certificate: ID
    }
  `,
  query: /* GraphQL */ ` 
  examTimeLeft: Int
  checkExamCooldown: Boolean
  `,
  mutation: /* GraphQL */ `
  updateMyself(input: updateUserInput): updateUserPayload!
  startExam(examId: ID!): updateUserPayload!
  submitExam(examId: ID!): examResults!
  checkExamQuestion(answers: [ID!]!): updateUserPayload!
  `,
  resolver: {
    Query: {
      examTimeLeft: {
        resolver: "plugins::users-permissions.user.examTimeLeft",
      },
      checkExamCooldown: {
        resolver: "plugins::users-permissions.user.checkExamCooldown",
      },
    },
    Mutation: {
      updateMyself: {
        description: "Update user's own data.",
        resolverOf: "plugins::users-permissions.user.updateMyself",
        resolver: async (obj, options, { context }) => {
          context.params = _.toPlainObject(options.input.where);
          context.request.body = _.toPlainObject(options.input.data);

          await strapi.plugins[
            "users-permissions"
          ].controllers.user.updateMyself(context);

          return {
            user: context.body.toJSON ? context.body.toJSON() : context.body,
          };
        },
      },
      startExam: {
        description: "Start exam's timer on self.",
        resolverOf: "plugins::users-permissions.user.startExam",
        resolver: async (obj, options, { context }) => {
          context.request.body = { examId: options.examId };
          await strapi.plugins["users-permissions"].controllers.user.startExam(
            context
          );

          return {
            user: context.body.toJSON ? context.body.toJSON() : context.body,
          };
        },
      },

      checkExamQuestion: {
        description: "Check validity of an exam question.",
        resolverOf: "plugins::users-permissions.user.checkExamQuestion",
        resolver: async (obj, options, { context }) => {
          context.request.body = { answers: options.answers };
          await strapi.plugins[
            "users-permissions"
          ].controllers.user.checkExamQuestion(context);

          return {
            user: context.body.toJSON ? context.body.toJSON() : context.body,
          };
        },
      },

      submitExam: {
        description: "Start exam's timer on self.",
        resolverOf: "plugins::users-permissions.user.submitExam",
        resolver: async (obj, options, { context }) => {
          context.request.body = { examId: options.examId };
          await strapi.plugins["users-permissions"].controllers.user.submitExam(
            context
          );

          return context.body;
        },
      },
    },
  },
};
