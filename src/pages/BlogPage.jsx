import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchBlogPosts } from '../services/api';
import { Reveal } from '../components/Reveal';
import { translated, translatedArray, useLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

export function BlogPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get('article'));

  useEffect(() => {
    fetchBlogPosts().then(setPosts);
  }, []);

  useEffect(() => {
    setSelectedId(searchParams.get('article'));
  }, [searchParams]);

  const activePost = posts.find((p) => p.id === selectedId);

  if (activePost) {
    const activeTitle = translated(activePost, 'title', language);
    const activeCategory = translated(activePost, 'category', language);
    const activeContent = translatedArray(activePost, 'content', language);
    return (
      <div className="pt-28 pb-24">
        <article className="max-w-3xl mx-auto px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#102355] hover:text-[#D2A058] mb-6"
          >
            <ArrowLeft size={14} /> {t('site.readArticles')}
          </button>
          <span className="block text-xs uppercase tracking-[0.22em] text-[#D2A058] font-semibold">
            {activeCategory} • {activePost.readTime}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#102355] leading-tight">
            {activeTitle}
          </h1>
          <img
            src={activePost.image}
            alt={activeTitle}
            className="mt-8 w-full aspect-[16/9] object-cover rounded-sm"
          />
          <div className="mt-8 space-y-5 text-base text-[#102355]/80 leading-relaxed">
            {activeContent.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
              {t('site.travelJournal')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
              {t('site.storiesGuides')}
            </h1>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.08}>
              <article className="h-full bg-white border border-[#D2A058]/30 rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <img src={post.image} alt={translated(post, 'title', language)} className="w-full h-56 object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#B88346] font-semibold">
                    {translated(post, 'category', language)} • {post.readTime}
                  </span>
                  <h2 className="mt-2 font-serif text-xl text-[#102355]">{translated(post, 'title', language)}</h2>
                  <p className="mt-3 text-sm text-[#102355]/75 flex-1">{translated(post, 'excerpt', language)}</p>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ article: post.id })}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-[#102355] hover:text-[#D2A058]"
                  >
                    {t('site.readArticle')} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
