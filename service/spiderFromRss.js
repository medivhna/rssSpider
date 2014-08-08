/**
 * Created by liu.xing on 14-2-24.
 *
 * 爬取RSS地址，装配成POST对象，并且存入mongodb
 * 1.  批量抓取到新闻的列表和链接
 * 2.  遍历链接获取到新闻正文，和新闻正文中的图片
 * 3.  存入mongodb数据库
 */
var spiderUtil = require('../service/spiderUtil');
var rssSite = require('../config/rssSite.json'); //rss website config file
var postService = require('../service/postService');
var cheerio = require('cheerio');

/**
 * 任务调度函数
 */
function rssSpider(callback){
        console.log("spider begin...")
        var sites = rssSite.sites;
        sites.forEach(function(site){
            site.channel.forEach(function(e){  //配置文件中的新闻rss url地址
                if(e.work !== "false"){
                    console.log("begin:"+ e.title);
                    spiderUtil.fetchRSS(e.link, e.typeId,function(posts){  //获取rss中所有的新闻
                        posts.forEach(function(post){
                            spiderUtil.getNewsContent(post.link, site.contentTag, site.textTag, site.encode, function(context, descImg){
                                if(descImg != null){
                                    post.descImg = descImg;
                                }
                                if(context != null && context !== ""){
                                    post.context = context;
                                }
                                postService.addPost(post);  //保存到数据库
                            });
                        });
                        callback();
                    });
                }
            });
        });
}
exports.rssSpider =rssSpider;

