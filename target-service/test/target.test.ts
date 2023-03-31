import chai, { expect } from "chai";
import chatHttp from "chai-http";
import Target, { ITarget } from "../src/models/target.model";
import app from "../src/index";
import chaiHttp from "chai-http";

chai.use(chatHttp);

const should = chai.should();

describe("Target API", function () {
  // it("should create a target", async function () {});
  it("should get all targets", (done) => {
    chai
      .request(app)
      .get("/getAllTargets")
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
      .get(
        "/findTargetParticipantByUser/64223effdcab2167b1d4905f?userId=696969123"
      )
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
});
