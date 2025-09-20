import { NextRequest, NextResponse } from 'next/server';
import { getTechspardhaTeamById } from '@/app/actions/techspardha_teams';

export async function GET(
  request: NextRequest,
  { params }: { params: { team: string } }
) {
  try {
    const team = params.team;
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }
    
    const teamData = await getTechspardhaTeamById(team);
    return NextResponse.json(teamData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch techspardha team' },
      { status: 500 }
    );
  }
}
