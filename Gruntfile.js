'use strict';

module.exports = function(grunt) {

  //Load assemble
  grunt.loadNpmTasks('assemble');

  //Load Handlebars to JST File Compiler
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // project specific custom export for AdobeCQ integration
  require('./tasks/cms')(grunt);
  require('./tasks/prototype')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // grunt config
  grunt.initConfig({

    // configurable paths
    configs: {
      app: 'assets',
      dist: 'dist',
      prototype: 'prototype',
      tmp: '.tmp',
      jsinternal: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-internal',
      jsexternal: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-external',
      csscore: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-internal',
      cssmdaweb: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/clientlib-internal',
      images: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/images',
      fonts: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/fonts'
    },

    watch: {
      compass: {
        files: ['<%= configs.app %>/styles/**/*.scss'],
        tasks: ['compass:prototype', 'autoprefixer']
      },
      styles: {
        files: ['<%= configs.app %>/styles/**/{,*/}*.css'],
        tasks: ['autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= configs.app %>/templates/**/*.hbs',
          '<%= configs.app %>/templates/helpers/*.js',
          '<%= configs.app %>/templates/data/*.{json,yml}',
          '{<%= configs.tmp %>,<%= configs.app %>}/styles/{,*/}*.css',
          '{<%= configs.tmp %>,<%= configs.app %>}/scripts/{,*/}*.js',
          '{<%= configs.tmp %>,<%= configs.app %>}/scripts/{,*/}*.hbs',
          '<%= configs.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['handlebars','copy:protoScripts', 'assemble']
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= configs.tmp %>',
            '<%= configs.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= configs.prototype %>'
        }
      }
    },

    clean: {
      prototype: {
        files: [{
          dot: true,
          src: [
            '<%= configs.tmp %>',
            '<%= configs.prototype %>/*',
            '!<%= configs.prototype %>/.git*'
          ]
        }]
      },
      server: '<%= configs.tmp %>',
      scripts: '<%= configs.tmp %>/scripts/*'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= configs.app %>/scripts/{,*/}*.js',
        '!<%= configs.app %>/scripts/vendor/*'
      ]
    },

    compass: {
      core: {
        options: {
          require: ['susy','breakpoint'],
          sassDir: '<%= configs.app %>/styles',
          cssDir: '<%= configs.tmp %>/styles',
          // importPath: '<%= configs.app %>/bower_components',
          httpImagesPath: '<%= configs.images %>',
          httpFontsPath: '<%= configs.fonts %>',
          relativeAssets: false
        }
      },
      prototype: {
        options: {
          require: ['susy','breakpoint'],
          sassDir: '<%= configs.app %>/styles',
          cssDir: '<%= configs.tmp %>/styles',
          // importPath: '<%= configs.app %>/bower_components',
          httpImagesPath: '<%= configs.images %>',
          httpFontsPath: '<%= configs.fonts %>',
          relativeAssets: false
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= configs.tmp %>/styles',
          src: '{,*/}*.css',
          dest: '<%= configs.tmp %>/styles'
        }]
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= configs.prototype %>'
      },
      html: '<%= configs.tmp %>/index.html'
    },

    usemin: {
      options: {
        dirs: ['<%= configs.prototype %>']
      },
      html: ['<%= configs.prototype %>/{,*/}*.html'],
      css: ['<%= configs.prototype %>/styles/{,*/}*.css']
    },

    modernizr: {
      devFile: '<%= configs.app %>/bower_components/modernizr/modernizr.js',
      outputFile: '<%= configs.jsexternal %>/modernizr/modernizr.js',
      uglify: true
    },

    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= configs.tmp %>',
          src: '*.html',
          dest: '<%= configs.prototype %>'
        }]
      },
      deploy: {
        options: {
          collapseWhitespace: false
        },
        files: [{
          expand: true,
          cwd: '<%= configs.prototype %>',
          src: '*.html',
          dest: '<%= configs.prototype %>'
        }]
      }
    },

    // Put files not handled in other tasks here
    copy: {
      ci: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>',
          dest: '<%= configs.prototype %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'mda-web/**'
          ]
        }]
      },
      scripts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>/scripts',
          dest: '<%= configs.jsinternal %>/js',
          src: '{,*/}*.js'
        }]
        //{
        //  expand: true,
        //  dot: true,
        //  cwd: '<%= configs.app %>',
        //  dest: '<%= configs.jsexternal %>',
        //  src: ['bower_components/{,*/}*']
        //}]
      },
      protoScripts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>/scripts',
          dest: '<%= configs.tmp %>/scripts/',
          src: '{,*/}*.js'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>',
          dest: '<%= configs.tmp %>',
          src: ['bower_components/**']
        }]
      },
      assets: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/concat/scripts',
          dest: '<%= configs.prototype %>/scripts',
          src: '**'
        },{
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/concat/templates',
          dest: '<%= configs.prototype %>/templates',
          src: '**'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/styles',
          dest: '<%= configs.prototype %>/styles',
          src: '**'
        }]
      },
      images: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/images',
        dest: '<%= configs.prototype %>/mda-web/images',
        src: '**'
      },
      fonts: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/fonts',
        dest: '<%= configs.prototype %>/mda-web/fonts',
        src: '**'
      },
      crossdomain: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/templates',
        dest: '<%= configs.tmp %>',
        src: 'crossdomain.xml'
      },
      mdaSkin: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/jwplayer',
        dest: '<%= configs.tmp %>',
        src: 'mdaSkin.xml'
      },
      crossdomainBuild: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/templates',
        dest: '<%= configs.prototype %>/site',
        src: 'crossdomain.xml'
      },
      mdaSkinBuild: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/jwplayer',
        dest: '<%= configs.prototype %>/site',
        src: 'mdaSkin.xml'
      },
      htmldist: {
        expand: true,
        dot: true,
        cwd: '<%= configs.tmp %>',
        dest: '<%= configs.prototype %>',
        src: '*.html'
      }
    },

    concurrent: {
      server: [
        'compass'
      ]
    },

    assemble: {
      options: {
        flatten: true,
        layoutdir: '<%= configs.app %>/templates/layouts',
        layout: 'default.hbs',
        partials: ['<%= configs.app %>/templates/partials/**/*.hbs'],
        helpers: ['<%= configs.app %>/templates/helpers/*.js'],
        data: '<%= configs.app %>/templates/data/*.json'
      },
      pages: {
        files: {
          '<%= configs.tmp %>/': [
            '<%= configs.app %>/templates/pages/{,*/}*.hbs'
          ]
        }
      }
    },

    bower: {
      options: {
        exclude: ['modernizr']
      }
    },

    prettify: {
      options: {},
      app: {
        expand: true,
        cwd: '<%= configs.tmp %>',
        ext: '.html',
        src: ['{,*/}*.html'],
        dest: '<%= configs.tmp %>'
      },
      prototype: {
        expand: true,
        cwd: '<%= configs.prototype %>/cms',
        ext: '.html',
        src: ['{,*/}*.html'],
        dest: '<%= configs.prototype %>/cms'
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: "APP.Templates",
          processName: function(filePath) {
            return filePath.replace(/^assets\/scripts\/hbs\//, '').replace(/\.hbs$/, '').replace(/-/g,'_');
          }
        },
        files: {
          "<%= configs.app %>/scripts/app.handlebar-templates.js": "<%= configs.app %>/scripts/hbs/*.hbs"
        }
      }
    },

    replace: {
      images: {
        src: ['<%= configs.prototype %>/cms/**/*.html'],
        overwrite: true,
        replacements: [{
          from: 'mda-web/images/',
          to: '../../site/mda-web/images/'
        }]
      },
      fonts: {
        src: ['<%= configs.prototype %>/site/styles/app.styles.css'],
        overwrite: true,
        replacements: [{
          from: '../../../mda-web/fonts/',
          to: '../mda-web/fonts/'
        }]
      },
      local: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocal: false',
          to: 'isLocal: true'
        }]
      },
      localbuild: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocal: true',
          to: 'isLocal: false'
        }]
      },
      localImages: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocalImages: false',
          to: 'isLocalImages: true'
        }]
      }
    },

    autoshot: {
      default_options: {
        options: {
          // necessary config
          path: '<%= configs.tmp %>/screenshots',
          // optional config, must set either remote or local
          remote: {
            files: [
              { src: "http://0.0.0.0:9000/becoming-our-patient.html", dest: "becoming-our-patient.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/blog-post.html", dest: "blog-post.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/blog.html", dest: "blog.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/breast-cancer-treatment.html", dest: "breast-cancer-treatment.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/breast-cancer.html", dest: "breast-cancer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/care-center.html", dest: "care-center.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/caregiver.html", dest: "caregiver.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/donate-volunteer.html", dest: "donate-volunteer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/life-after-cancer.html", dest: "life-after-cancer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/patients-family.html", dest: "patients-family.png", delay: 1000 }
            ]
          },
          viewport: ['375x600', '768x800', '1440x1080']
        },
      },
    },

    groc: {
      javascript: [
        "<%= configs.app %>/scripts/*.js",
        "<%= configs.app %>/templates/partials/modules/*.hbs",
        "README.md",
        "layout-guide.hbs"
      ],
      options: {
        "out": "<%= configs.prototype %>/docs/",
        "except": "assets/scripts/footable.js"
      }
    },

    cms: {
      build: {
        dist: "<%= configs.dist %>",
        tmp: "<%= configs.tmp %>",
        dest: "<%= configs.dist %>/cms",
        csscore: "<%= configs.csscore %>",
        cssmdaweb: "<%= configs.cssmdaweb %>",
        jsinternal: "<%= configs.jsinternal %>",
        app: "<%= configs.app %>",
        mainCSS: "app.styles.css",
        mainJS: "app.main.js",
        globals: {
          scss: {
            dir: [
              '<%= configs.app %>/styles/'
            ],
            styles: [
              '<%= configs.app %>/assets/styles/globals/'
            ]
          }
        }
      }
    },

    prototypeBuild: {
      build: {
        dist: "<%= configs.prototype %>",
        dest: "<%= configs.prototype %>/cms",
        templates: "<%= configs.app %>/templates",
        app: "<%= configs.app %>",
        tmp: "<%= configs.tmp %>",
        mainCSS: "app.styles.css",
        mainJS: "app.main.js",
        module: {
          dirs: {
            markup: '<%= configs.app %>/templates/partials/modules/',
            scripts: '<%= configs.app %>/scripts/'
          },
          layout: '<%= configs.app %>/templates/layouts/cms.hbs',
          preview: '<%= configs.app %>/templates/layouts/cms-preview.hbs',
          data: {
            "accordion": "modules_accordion.breast-cancer-1",
            // "account-bar": "modules_",
            // "alerts": "modules_",
            // "anchor-links": "modules_",
            "appointment-bar": "modules_layout.appointment-bar",
            "article-blog": "modules_article_blog.blog-post-1",
            // "badge": "modules_",
            "basic-content-media": "modules_basic_content_media.patients-family-1",
            "basic-content": "modules_basic_content.breast-cancer-1",
            // "bio-preview": "modules_",
            // "bio": "modules_",
            "clinical-trials-header": "clinical_trials.clinical-trials-detail-header",
            "page-header": "publications.publication-issue-header",
            "blog-search-filter": "modules_layout.blog-search-filter",
            "blog-summary": "modules_blog_summary.blog-1",
            "carousel-hero": "modules_carousel.patients-family-hero",
            "carousel": "modules_carousel.patients-family-1",
            "collection": "modules_collection.patients-family-1",
            "comments": "modules_layout.comments",
            // "donate": "modules_",
            // "drill-down-list": "modules_",
            "events": "modules_events.event-1.data",
            // "explicit-personalization-module": "modules_",
            "faculty-listing": "modules_carousel.faculty-listing",
            "flip-hero": "modules_hero.donate-volunteer",
            // "footer": "modules_",
            // "form-elements": "modules_",
            "glossary": "modules_glossary.glossary-example-01",
            // "header": "modules_",
            "headline": "modules_headline.donate-volunteer-1",
            "link-list": [
              "modules_link_list.patients-family-1",
              "modules_link_list.blog-1"
            ],
            "media-player": "modules_media_player.care-center",
            // "navigation": "modules_",
            "newsfeed": "modules_link_list.blog-1",
            // "overlay": "modules_",
            // "pre-footer": "modules_",
            "promos": "modules_promo.breast-cancer-1",
            "search-block": "modules_search_block.patients-family-1",
            // "section-callout": "modules_",
            "sentence-filter": "modules_layout.sentence-filter",
            // "share": "modules_",
            // "sidebar": "modules_",
            "sitemap-accordion": "modules_sitemap_accordion.patients-family-1",
            "stand-alone-quote": "modules_stand_alone_quote.becoming-our-patient-1",
            "static-hero": "modules_hero.becoming-our-patient",
            "subnavigation": "data_navigation.subnav-data",
            // "tabs": "modules_",
            "teaser": "modules_teaser.care-center-1",
            "video-carousel": "video_carousel.video-carousel-1",
            // "tophat": "modules_",
            // "video": "modules_",
            "search-filter": "search-results.search-results-filters-1",
            "search-suggested-content": "search-results.suggestedResults",
            "search-result": "search-results.allResults",
            "publication-subscribe": "publications.publications-1",
            "social-feed": "social_feed.social-feed-example",
            "resource-collection": [
              "resource_center.resource-collections-patient-ed",
              "resource_center.resource-collections-podcasts",
              "resource_center.resource-collections-news-releases"
            ]
          }
        },
        globals: {
          scss: {
            dir: [
              '<%= configs.app %>/styles/'
            ],
            styles: [
              '<%= configs.app %>/styles/globals/'
            ]
          },
          scripts: {
            concat: {
              libs: [
                "<%= configs.app %>/bower_components/jquery/dist/jquery.js",
                "<%= configs.app %>/bower_components/modernizr/modernizr.js"
              ],
              main: [
                "<%= configs.app %>/scripts/app.main.js",
                "<%= configs.app %>/scripts/app.global-carousel.js",
                "<%= configs.app %>/scripts/app.tabs.js",
                "<%= configs.app %>/scripts/app.modal.js",
                "<%= configs.app %>/scripts/app.search.js",
                "<%= configs.app %>/scripts/app.scroll-transitions.js",
                "<%= configs.app %>/scripts/app.video.js"
              ]
            },
            modules: [

            ]
          },
          images: '<%= configs.app %>/mda-web/images/',
          fonts: '<%= configs.app %>/mda-web/fonts/'
        }
      }
    }

  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') return grunt.task.run(['build', 'connect:dist:keepalive']);

    grunt.task.run([
      'clean:server',
      'assemble',
      'handlebars',
      'concurrent:',
      'autoprefixer',
      'copy:protoScripts',
      'copy:crossdomain',
      'copy:mdaSkin',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'compass:core',
    'handlebars',
    'autoprefixer',
    'copy:scripts',
    'replace:localbuild',
    'cms'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('prototype', [
    'clean:prototype',
    'assemble',
    'handlebars',
    'useminPrepare',
    'concurrent:server',
    // 'htmlmin:dist',
    'copy:htmldist',
    'autoprefixer',
    'copy:images',
    'copy:fonts',
    'copy:protoScripts',
    'concat',
    'copy:ci',
    'usemin',
    'copy:assets',
    'prototypeBuild',
    'replace:images',
    'replace:fonts',
    'replace:local',
    'replace:localImages',
    // 'prettify:prototype',
    'copy:crossdomainBuild',
    'copy:mdaSkinBuild',
    'groc'
  ]);

  grunt.registerTask('qabuild', [
    'clean:prototype',
    'assemble',
    'handlebars',
    'useminPrepare',
    'concurrent:server',
    // 'htmlmin:dist',
    'copy:htmldist',
    'autoprefixer',
    'copy:images',
    'copy:fonts',
    'copy:protoScripts',
    'concat',
    'copy:ci',
    'usemin',
    'copy:assets',
    'prototypeBuild',
    'replace:images',
    'replace:fonts',
    'replace:localbuild',
    'replace:localImages',
    // 'prettify:prototype',
    'copy:crossdomainBuild',
    'copy:mdaSkinBuild',
    'groc'
  ]);
};

