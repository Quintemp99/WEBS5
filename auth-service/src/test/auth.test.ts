import express, { Application } from "express";
import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";
import { app } from "./pre-test/index";

dotenv.config();
chai.use(chaiHttp);
const expect = chai.expect;

describe("Authentication API Tests", () => {
  it("should return an error for invalid login credentials", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "test3@gmail.com",
        password: "pass5syg4eyword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500); // or any other expected status code
        expect(res.body).to.have.property("error");
        done();
      });
  });

  it("should register a new user and return success message and user details", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({
        email: "test3@gmail.com",
        password: "password",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Signup successful");
        expect(res.body).to.have.property("user").to.be.an("object");
        done();
      });
  });

  // Test for successful login
  it("should login user and return a JWT token", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "test3@gmail.com",
        password: "password",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  // Test for failed registration
  it("should return an error for invalid registration data", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({
        email: "test3@gmail.com",
        password: "",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return an error bc endpoint doesnt exist", (done) => {
    chai
      .request(app)
      .get("/invalid-route")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
