import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllTechspardhaTeams, 
  getTechspardhaTeamById, 
  createTechspardhaTeam, 
  updateTechspardhaTeam, 
  deleteTechspardhaTeam 
} from '@/app/actions/techspardha_teams';

export async function GET(request: NextRequest) {
  try {
    const teams = await getAllTechspardhaTeams();
    return NextResponse.json(teams, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch techspardha teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team, data } = body;
    
    if (!team || !data) {
      return NextResponse.json(
        { error: 'Team name and data are required' },
        { status: 400 }
      );
    }
    
    await createTechspardhaTeam(team, data);
    return NextResponse.json(
      { message: 'Techspardha team created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create techspardha team' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { team, data } = body;
    
    if (!team || !data) {
      return NextResponse.json(
        { error: 'Team name and data are required' },
        { status: 400 }
      );
    }
    
    await updateTechspardhaTeam(team, data);
    return NextResponse.json(
      { message: 'Techspardha team updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update techspardha team' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }
    
    await deleteTechspardhaTeam(team);
    return NextResponse.json(
      { message: 'Techspardha team deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete techspardha team' },
      { status: 500 }
    );
  }
}
