"use strict";

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  /**
   * Retrieve user records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    let users;

    if (_.has(ctx.query, "_q")) {
      // use core strapi query to search for users
      users = await strapi
        .query("user", "users-permissions")
        .search(ctx.query, populate);
    } else {
      users = await strapi.plugins["users-permissions"].services.user.fetchAll(
        ctx.query,
        populate
      );
    }

    const data = users.map(sanitizeUser);
    ctx.send(data);
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = sanitizeUser(user);
    ctx.send(data);
  },

  /**
   * Retrieve a user record.
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    let data = await strapi.plugins["users-permissions"].services.user.fetch({
      id,
    });

    if (data) {
      data = sanitizeUser(data);
    }

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const { email, username, password, role } = ctx.request.body;

    if (!email) return ctx.badRequest("missing.email");
    if (!username) return ctx.badRequest("missing.username");
    if (!password) return ctx.badRequest("missing.password");

    const userWithSameUsername = await strapi
      .query("user", "users-permissions")
      .findOne({ username });

    if (userWithSameUsername) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.username.taken",
          message: "Username already taken.",
          field: ["username"],
        })
      );
    }

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi
        .query("user", "users-permissions")
        .findOne({ email });

      if (userWithSameEmail) {
        return ctx.badRequest(
          null,

          formatError({
            id: "Auth.form.error.email.taken",
            message: "Email already taken.",
            field: ["email"],
          })
        );
      }
    }

    const user = {
      ...ctx.request.body,
      provider: "local",
    };

    if (!role) {
      const defaultRole = await strapi
        .query("role", "users-permissions")
        .findOne({ type: advanced.default_role }, []);

      user.role = defaultRole.id;
    }

    try {
      const data = await strapi.plugins["users-permissions"].services.user.add(
        user
      );

      ctx.created(data);
    } catch (error) {
      ctx.badRequest(null, formatError(error));
    }
  },

  /**
   * Update a/an user record.
   * @return {Object}
   */
  async update(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    // const id = ctx.state.user.id;
    // const { email, username, password } = ctx.request.body;

    // if (id !== ctx.params.id) {
    //   return ctx.badRequest("Unauthorized");
    // }
    const { id } = ctx.params;
    const { email, username, password } = ctx.request.body;

    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id,
    });

    if (_.has(ctx.request.body, "email") && !email) {
      return ctx.badRequest("email.notNull");
    }

    if (_.has(ctx.request.body, "username") && !username) {
      return ctx.badRequest("username.notNull");
    }

    if (
      _.has(ctx.request.body, "password") &&
      !password &&
      user.provider === "local"
    ) {
      return ctx.badRequest("password.notNull");
    }

    if (_.has(ctx.request.body, "username")) {
      const userWithSameUsername = await strapi
        .query("user", "users-permissions")
        .findOne({ username });

      if (userWithSameUsername && userWithSameUsername.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.username.taken",
            message: "username.alreadyTaken.",
            field: ["username"],
          })
        );
      }
    }

    if (_.has(ctx.request.body, "email") && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query("user", "users-permissions")
        .findOne({ email });

      if (userWithSameEmail && userWithSameEmail.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.email.taken",
            message: "Email already taken",
            field: ["email"],
          })
        );
      }
    }

    let updateData = {
      ...ctx.request.body,
    };

    if (_.has(ctx.request.body, "password") && password === user.password) {
      delete updateData.password;
    }

    const data = await strapi.plugins["users-permissions"].services.user.edit(
      { id },
      updateData
    );

    ctx.send(data);
  },

  /**
   * Update a/an user's own record.
   * @return {Object}
   */
  async updateMyself(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }

    if (
      _.has(ctx.request.body, "completedLessons") ||
      _.has(ctx.request.body, "completedCourses") ||
      _.has(ctx.request.body, "completedQuizzes") ||
      _.has(ctx.request.body, "invitee")
    ) {
      let updateData = {
        ...ctx.request.body,
      };

      const data = await strapi.plugins["users-permissions"].services.user.edit(
        { id },
        updateData
      );

      ctx.send(data);
    } else {
      return ctx.badRequest("Unauthorized field");
    }
  },

  /**
   * Start an exam timer.
   * @return {Object}
   */
  async startExam(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }

    if (_.has(ctx.request.body, "examId")) {
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetch({
        id,
      });
      const startedAt = Date.now();
      if (
        user.examCooldown === false ||
        startedAt - user.failedExamAt > 720 * 60000
      ) {
        let updateData = {
          currentExam: {
            startedAt: startedAt,
            exam: ctx.request.body.examId,
            currentQuestionIndex: 0,
          },
          examCooldown: user.examCooldown,
        };
        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.edit({ id }, updateData);
        ctx.send(data);
      } else {
        let updateData = {
          examCooldown: true,
        };
        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.edit({ id }, updateData);
        ctx.send(data);
      }
    } else {
      return ctx.badRequest("Unauthorized field");
    }
  },

  /**
   * Check exam's time left.
   * @return {Object}
   */
  async examTimeLeft(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }

    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id,
    });
    const examId = user.currentExam.exam.id;
    const examData = await strapi.services.quiz.findOne({
      id: examId,
    });
    const currentExamStartTime = parseInt(user.currentExam.startedAt);
    const now = Date.now();
    const examTimeLimit = parseInt(examData.examTimeLimit) * 60;
    const timeLeft = Math.abs(
      Math.round((now - currentExamStartTime) / 1000 - examTimeLimit)
    );
    ctx.send(timeLeft);
  },

  /**
   * Check if user has failed and has cooldown on exam.
   * @return {Object}
   */
  async checkExamCooldown(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }

    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id,
    });
    const now = Date.now();

    if (now - user.failedExamAt > 720 * 60000) {
      let updateData = {
        currentExam: null,
        examCooldown: false,
      };
      const data = await strapi.plugins["users-permissions"].services.user.edit(
        { id },
        updateData
      );
      ctx.send(false);
    } else {
      ctx.send(true);
    }
  },

  /**
   * Check exam question.
   * @return {Object}
   */
  async checkExamQuestion(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }
    if (_.has(ctx.request.body, "answers")) {
      const { answers } = ctx.request.body;
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetch({
        id,
      });
      if (user.examCooldown === false) {
        const examId = user.currentExam.exam.id;
        const examData = await strapi.services.quiz.findOne({
          id: examId,
        });
        const pointsToPassExam = examData.pointsToPassExam;
        const currentQuestionIndex =
          parseInt(user.currentExam.currentQuestionIndex) || 0;
        const possibleAnswers =
          examData.questions[currentQuestionIndex].answers;

        const currentPoints = parseInt(user.currentExam.currentPoints) || 0;

        const questionPoints = examData.questions[currentQuestionIndex].points;

        const startedAt = user.currentExam.startedAt;
        const correctAnswers = possibleAnswers.filter(
          (el) => el.correct === true
        );
        const correctAnswersIds = correctAnswers.map((el) => el.id);
        const userAnswersIds = [...answers];

        const answersAreCorrect = _(correctAnswersIds)
          .differenceWith(userAnswersIds, _.isEqual)
          .isEmpty();

        console.log(
          `Correct answers ids: ${userAnswersIds}, User IDs: ${userAnswersIds} is it correct: ${answersAreCorrect}`
        );

        let updateData = {};

        if (currentQuestionIndex + 1 <= examData.questions.length) {
          if (answersAreCorrect) {
            updateData = {
              currentExam: {
                startedAt: startedAt,
                exam: examId,
                currentPoints: currentPoints + questionPoints,
                currentQuestionIndex: currentQuestionIndex + 1,
              },
            };
          } else {
            updateData = {
              currentExam: {
                startedAt: startedAt,
                exam: examId,
                currentPoints: currentPoints,
                currentQuestionIndex: currentQuestionIndex + 1,
              },
            };
          }
        }

        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.edit({ id }, updateData);

        ctx.send(data);
      } else {
        return ctx.badRequest("Unauthorized");
      }
    }
  },

  /**
   * Submit exam.
   * @return {Object}
   */
  async submitExam(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced",
      })
      .get();

    const id = ctx.state.user.id;

    if (id === null) {
      return ctx.badRequest("Unauthorized");
    }

    if (_.has(ctx.request.body, "examId")) {
      const { examId } = ctx.request.body;
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetch({
        id,
      });
      const examData = await strapi.services.quiz.findOne({
        id: examId,
      });
      const previous_quizzes = user.completedQuizzes;
      const currentExam = user.currentExam;
      const failedExamAt = user.failedExamAt || 0;
      const submittedAt = Date.now();

      let updateData = {};

      if (
        submittedAt - currentExam.startedAt < examData.examTimeLimit * 60000 &&
        currentExam.currentPoints >= examData.pointsToPassExam
      ) {
        const certificate = await strapi.services.certificate.create({
          firstName: user.firstName,
          lastName: user.lastName,
          certifiedAt: submittedAt,
        });

        updateData = {
          completedQuizzes: [...previous_quizzes, examId],
          currentExam: null,
          certificate: certificate.id,
          examScore: currentExam.currentPoints,
        };

        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.edit({ id }, updateData);

        const res = {
          score: currentExam.currentPoints,
          passed: true,
          passedOnTime: true,
          certificate: certificate.id,
        };

        ctx.send(res);
      } else {
        updateData = {
          currentExam: {
            startedAt: currentExam.startedAt,
            exam: ctx.request.body.examId,
            currentQuestionIndex: 0,
            currentPoints: 0,
          },
          examScore: currentExam.currentPoints,
          failedExamAt: submittedAt,
          examCooldown: true,
        };

        const data = await strapi.plugins[
          "users-permissions"
        ].services.user.edit({ id }, updateData);

        const res = {
          score: currentExam.currentPoints,
          passed: false,
          passedOnTime: false,
        };
        ctx.send(res);
      }
    } else {
      return ctx.badRequest("Unauthorized field");
    }
  },

  /**
   * Destroy a/an user record.
   * @return {Object}
   */
  async destroy(ctx) {
    const { id } = ctx.params;
    const data = await strapi.plugins[
      "users-permissions"
    ].services.user.remove({ id });
    ctx.send(data);
  },

  async destroyAll(ctx) {
    const data = await strapi.plugins[
      "users-permissions"
    ].services.user.removeAll({}, ctx.request.query);

    ctx.send(data);
  },
};
