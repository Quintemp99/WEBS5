import chai, { expect } from "chai";
import chatHttp from "chai-http";
import Target, { ITarget } from "../models/target.model";
import app from "../index";
import chaiHttp from "chai-http";

chai.use(chatHttp);

const should = chai.should();

describe("Target API", function () {
  // it("should create a target", async function () {});
  it("should get all targets", (done) => {
    chai
      .request(app)
      .get("/target")
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
  // it("should get a target image", async function () {});
  it("should find a target participant by user", (done) => {
    chai
      .request(app)
      .get("/target/642c30e3179f34a3a04b026f?userId=123")
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
});
