const { Ci, Cm, Cr, components } = require('chrome');
const self = require('sdk/self');
const services = require('resource://gre/modules/Services.jsm').Services;
const XPCOMUtils = require('resource://gre/modules/XPCOMUtils.jsm').XPCOMUtils;

const aboutpage = {
  createAboutPage : function (page) {
    return {
      QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

      getURIFlags: function(aURI) {
        return Ci.nsIAboutModule.ALLOW_SCRIPT;
      },

      newChannel: function(aURI, aSecurity_or_aLoadInfo) {
        let channel;

        // Firefox >= 48
        if (services.vc.compare(services.appinfo.version, '47.*') > 0) {
          const uri = services.io.newURI(self.data.url('html/' + page + '.html'), null, null);
          channel = services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
        }
        // Firefox <= 47
        else {
          channel = services.io.newChannel(self.data.url('html/' + page + '.html'), null, null);
        }

        channel.originalURI = aURI;
        return channel;
      }
    };
  },

  createAboutPageFactory : function (page) {
    return {
      createInstance : function (outer, iid) {
        if (outer) {
          throw Cr.NS_ERROR_NO_AGGREGATION;
        }

        return page.QueryInterface(iid);
      }
    }
  },

  registerAboutPage : function (uuid, uri, page, factory) {
    Cm.QueryInterface(Ci.nsIComponentRegistrar).registerFactory(
      components.ID(uuid), uri, '@mozilla.org/network/protocol/about;1?what=' + page, factory
    );
  },

  unregisterAboutPage : function (uuid, factory) {
    Cm.QueryInterface(Ci.nsIComponentRegistrar).unregisterFactory(
      components.ID(uuid), factory
    );
  }
};

exports.createAboutPage = aboutpage.createAboutPage;
exports.createAboutPageFactory = aboutpage.createAboutPageFactory;
exports.registerAboutPage = aboutpage.registerAboutPage;
exports.unregisterAboutPage = aboutpage.unregisterAboutPage;
