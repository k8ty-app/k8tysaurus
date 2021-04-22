
val preDotty = "2.13.4"
val dottyVersion = "3.0.0-M2"

lazy val k8tysaurus = project
  .in(file("."))
  .settings(
    name := "k8tysaurus",
    version := "0.1.0",
    scalaVersion := preDotty,
    libraryDependencies ++= Seq(
      "dev.zio" %% "zio" % "1.0.6",
      "dev.zio" %% "zio-prelude" % "1.0.0-RC3"
    )
  )

lazy val docs = project
  .settings(
    moduleName := "k8tysaurus-docs",
    scalaVersion := preDotty,
    mdocIn := file("k8tysaurus/mdocs"),
    mdocOut := file("k8tysaurus/docs")
  )
  .dependsOn(k8tysaurus)
  .enablePlugins(MdocPlugin)

lazy val blog = project
  .settings(
    moduleName := "k8tysaurus-blog",
    scalaVersion := preDotty,
    mdocIn := file("k8tysaurus/mblog"),
    mdocOut := file("k8tysaurus/blog")
  )
  .dependsOn(k8tysaurus)
  .enablePlugins(MdocPlugin)
