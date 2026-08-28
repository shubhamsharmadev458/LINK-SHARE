import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StandardLinkData } from '@/lib/types';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await props.params;

  try {
    const block = await prisma.block.findUnique({
      where: { id: linkId }
    });

    if (!block || block.type !== 'standard_link') {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Log the click asynchronously
    const userAgent = req.headers.get('user-agent') || undefined;
    const referrer = req.headers.get('referer') || undefined;
    
    // We do not await this to keep the redirect fast
    prisma.analyticsEvent.create({
      data: {
        type: 'link_click',
        linkId: linkId,
        profileId: block.profileId,
        userAgent,
        referrer,
      }
    }).catch(console.error);

    let urlToRedirect = '';
    try {
      const data = JSON.parse(block.data) as StandardLinkData;
      urlToRedirect = data.url;
    } catch(e) {
      return NextResponse.json({ error: 'Invalid link data' }, { status: 500 });
    }

    if (!urlToRedirect) {
      return NextResponse.json({ error: 'URL is empty' }, { status: 400 });
    }

    return NextResponse.redirect(urlToRedirect, 302);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
